// 示例代码仅供参考，请勿在生产环境中直接使用
'use strict';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

const bailian20231229 = require('@alicloud/bailian20231229');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');
const Tea = require('@alicloud/tea-typescript');

class KbCreate {

  /**
   * 检查并提示设置必要的环境变量
   * @returns {boolean} - 如果所有必需的环境变量都已设置，返回 true；否则返回 false
   */
  static checkEnvironmentVariables() {
    const requiredVars = {
      'ALIBABA_CLOUD_ACCESS_KEY_ID': '阿里云访问密钥ID',
      'ALIBABA_CLOUD_ACCESS_KEY_SECRET': '阿里云访问密钥密码',
      'WORKSPACE_ID': '阿里云百炼业务空间ID'
    };

    const missing = [];
    for (const [varName, desc] of Object.entries(requiredVars)) {
      if (!process.env[varName]) {
        console.error(`错误：请设置 ${varName} 环境变量 (${desc})`);
        missing.push(varName);
      }
    }
    return missing.length === 0;
  }

  /**
   * 计算文件的MD5值
   * @param {string} filePath - 文件本地路径
   * @returns {Promise<string>} - 文件的MD5值
   */
  static async calculateMD5(filePath) {
    const hash = crypto.createHash('md5');
    const stream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
      stream.on('data', chunk => hash.update(chunk));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  /**
   * 获取文件大小（以字节为单位），返回字符串格式
   * @param {string} filePath - 文件本地路径
   * @returns {string} - 文件大小（如 "123456"）
   */
  static getFileSize(filePath) {
    try {
      const stats = fs.statSync(filePath);
      return stats.size.toString();
    } catch (err) {
      console.error(`获取文件大小失败: ${err.message}`);
      throw err;
    }
  }

  /**
   * 创建并配置客户端（Client）
   * @return Client
   * @throws Exception
   */
  static createClient() {
    const config = new OpenApi.Config({
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET
    });
    // 下方接入地址以公有云的公网接入地址为例，可按需更换接入地址
    config.endpoint = `bailian.cn-beijing.aliyuncs.com`;
    return new bailian20231229.default(config);
  }

  /**
   * 申请文件上传租约
   * @param {Bailian20231229Client} client - 客户端（Client）
   * @param {string} categoryId - 类目ID
   * @param {string} fileName - 文件名称
   * @param {string} fileMd5 - 文件的MD5值
   * @param {string} fileSize - 文件大小（以字节为单位）
   * @param {string} workspaceId - 业务空间ID
   * @returns {Promise<bailian20231229.ApplyFileUploadLeaseResponse>} - 阿里云百炼服务的响应
   */
  static async applyLease(client, categoryId, fileName, fileMd5, fileSize, workspaceId) {
    const headers = {};
    const req = new bailian20231229.ApplyFileUploadLeaseRequest({
      md5: fileMd5,
      fileName,
      sizeInBytes: fileSize
    });
    const runtime = new Util.RuntimeOptions({});
    return await client.applyFileUploadLeaseWithOptions(
      categoryId,
      workspaceId,
      req,
      headers,
      runtime
    );
  }

  /**
   * 上传文件到临时存储
   * @param {string} preSignedUrl - 上传租约中的URL
   * @param {Object} headers - 上传请求的头部
   * @param {string} filePath - 文件本地路径
   */
  static async uploadFile(preSignedUrl, headers, filePath) {
    const uploadHeaders = {
      "X-bailian-extra": headers["X-bailian-extra"],
      "Content-Type": headers["Content-Type"]
    };
    const stream = fs.createReadStream(filePath);
    try {
      await axios.put(preSignedUrl, stream, { headers: uploadHeaders });
    } catch (e) {
      throw new Error(`上传失败: ${e.message}`);
    }
  }

  /**
   * 添加文件到类目中
   * @param {Bailian20231229Client} client - 客户端（Client）
   * @param {string} leaseId - 租约ID
   * @param {string} parser - 用于文件的解析器
   * @param {string} categoryId - 类目ID
   * @param {string} workspaceId - 业务空间ID
   * @returns {Promise<bailian20231229.AddFileResponse>} - 阿里云百炼服务的响应
   */
  static async addFile(client, leaseId, parser, categoryId, workspaceId) {
    const headers = {};
    const req = new bailian20231229.AddFileRequest({
      leaseId,
      parser,
      categoryId
    });
    const runtime = new Util.RuntimeOptions({});
    return await client.addFileWithOptions(workspaceId, req, headers, runtime);
  }

  /**
   * 查询文件的解析状态
   * @param {Bailian20231229Client} client - 客户端（Client）
   * @param {string} workspaceId - 业务空间ID
   * @param {string} fileId - 文件ID
   * @returns {Promise<bailian20231229.DescribeFileResponse>} - 阿里云百炼服务的响应
   */
  static async describeFile(client, workspaceId, fileId) {
    const headers = {};
    const runtime = new Util.RuntimeOptions({});
    return await client.describeFileWithOptions(workspaceId, fileId, headers, runtime);
  }

  /**
   * 初始化知识库（索引）
   * @param {Bailian20231229Client} client - 客户端（Client）
   * @param {string} workspaceId - 业务空间ID
   * @param {string} fileId - 文件ID
   * @param {string} name - 知识库名称
   * @param {string} structureType - 知识库的数据类型
   * @param {string} sourceType - 应用数据的数据类型，支持类目类型和文件类型
   * @param {string} sinkType - 知识库的向量存储类型
   * @returns {Promise<bailian20231229.CreateIndexResponse>} - 阿里云百炼服务的响应
   */
  static async createIndex(client, workspaceId, fileId, name, structureType, sourceType, sinkType) {
    const headers = {};
    const req = new bailian20231229.CreateIndexRequest({
      name,
      structureType,
      documentIds: [fileId],
      sourceType,
      sinkType
    });
    const runtime = new Util.RuntimeOptions({});
    return await client.createIndexWithOptions(workspaceId, req, headers, runtime);
  }

  /**
   * 提交索引任务
   * @param {Bailian20231229Client} client - 客户端（Client）
   * @param {string} workspaceId - 业务空间ID
   * @param {string} indexId - 知识库ID
   * @returns {Promise<bailian20231229.SubmitIndexJobResponse>} - 阿里云百炼服务的响应
   */
  static async submitIndex(client, workspaceId, indexId) {
    const headers = {};
    const req = new bailian20231229.SubmitIndexJobRequest({ indexId });
    const runtime = new Util.RuntimeOptions({});
    return await client.submitIndexJobWithOptions(workspaceId, req, headers, runtime);
  }

  /**
   * 查询索引任务状态
   * @param {Bailian20231229Client} client - 客户端（Client）
   * @param {string} workspaceId - 业务空间ID
   * @param {string} jobId - 任务ID
   * @param {string} indexId - 知识库ID
   * @returns {Promise<bailian20231229.GetIndexJobStatusResponse>} - 阿里云百炼服务的响应
   */
  static async getIndexJobStatus(client, workspaceId, jobId, indexId) {
    const headers = {};
    const req = new bailian20231229.GetIndexJobStatusRequest({ jobId, indexId });
    const runtime = new Util.RuntimeOptions({});
    return await client.getIndexJobStatusWithOptions(workspaceId, req, headers, runtime);
  }

  /**
   * 创建知识库
   * @param {string} filePath - 文件本地路径
   * @param {string} workspaceId - 业务空间ID
   * @param {string} name - 知识库名称
   * @returns {Promise<string | null>} - 如果成功，返回知识库ID；否则返回null
   */
  static async createKnowledgeBase(filePath, workspaceId, name) {
    const categoryId = 'default';
    const parser = 'DASHSCOPE_DOCMIND';
    const sourceType = 'DATA_CENTER_FILE';
    const structureType = 'unstructured';
    const sinkType = 'DEFAULT';

    try {
      console.log("步骤1：初始化Client");
      const client = this.createClient();

      console.log("步骤2：准备文件信息");
      const fileName = path.basename(filePath);
      const fileMd5 = await this.calculateMD5(filePath);
      const fileSize = this.getFileSize(filePath);

      console.log("步骤3：向阿里云百炼申请上传租约")
      const leaseRes = await this.applyLease(client, categoryId, fileName, fileMd5, fileSize, workspaceId);
      const leaseId = leaseRes.body.data.fileUploadLeaseId;
      const uploadUrl = leaseRes.body.data.param.url;
      const uploadHeaders = leaseRes.body.data.param.headers;

      console.log("步骤4：上传文件到阿里云百炼")
      await this.uploadFile(uploadUrl, uploadHeaders, filePath);

      console.log("步骤5：将文件添加到阿里云百炼服务器")
      const addRes = await this.addFile(client, leaseId, parser, categoryId, workspaceId);
      const fileId = addRes.body.data.fileId;

      console.log("步骤6：检查阿里云百炼中的文件状态")
      while (true) {
        const descRes = await this.describeFile(client, workspaceId, fileId);
        const status = descRes.body.data.status;
        console.log(`当前文件状态：${status}`);

        if (status === 'INIT') console.log("文件待解析，请稍候...");
        else if (status === 'PARSING') console.log("文件解析中，请稍候...");
        else if (status === 'PARSE_SUCCESS') break;
        else {
          console.error(`未知的文件状态：${status}，请联系技术支持。`);
          return null;
        }
        await this.sleep(5);
      }

      console.log("步骤7：在阿里云百炼中初始化知识库")
      const indexRes = await this.createIndex(client, workspaceId, fileId, name, structureType, sourceType, sinkType);
      const indexId = indexRes.body.data.id;

      console.log("步骤8：向阿里云百炼提交索引任务")
      const submitRes = await this.submitIndex(client, workspaceId, indexId);
      const jobId = submitRes.body.data.id;

      console.log("步骤9：获取阿里云百炼索引任务状态")
      while (true) {
        const jobRes = await this.getIndexJobStatus(client, workspaceId, jobId, indexId);
        const status = jobRes.body.data.status;
        console.log(`当前索引任务状态：${status}`);
        if (status === 'COMPLETED') break;
        await this.sleep(5);
      }
      console.log("阿里云百炼知识库创建成功！");
      return indexId;
    } catch (e) {
      console.error(`发生错误：${e.message}`);
      return null;
    }
  }

  /**
   * 等待指定时间（秒）
   * @param {number} seconds - 等待时间（秒）
   * @returns {Promise<void>}
   */
  static sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
  }

  static async main(args) {
    if (!this.checkEnvironmentVariables()) {
      console.log("环境变量校验未通过。");
      return;
    }

    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    try {
      const filePath = await new Promise((resolve, reject) => {
        readline.question("请输入您需要上传文件的实际本地路径（以Linux为例：/xxx/xxx/阿里云百炼系列手机产品介绍.docx）：", (ans) => {
          ans.trim() ? resolve(ans) : reject(new Error("路径不能为空"));
        });
      });
      const kbName = await new Promise((resolve, reject) => {
        readline.question("请为您的知识库输入一个名称：", (ans) => {
          ans.trim() ? resolve(ans) : reject(new Error("知识库名称不能为空"));
        });
      });
      const workspaceId = process.env.WORKSPACE_ID;

      const result = await KbCreate.createKnowledgeBase(filePath, workspaceId, kbName);
      if (result) console.log(`知识库ID: ${result}`);
      else console.log("知识库创建失败。");
    } catch (err) {
      console.error(err.message);
    } finally {
      readline.close();
    }
  }
}

exports.KbCreate = KbCreate;
KbCreate.main(process.argv.slice(2));