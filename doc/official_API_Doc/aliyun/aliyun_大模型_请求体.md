import OpenAI from "openai";

const openai = new OpenAI({
    // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx"
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/api/v2/apps/protocols/compatible-mode/v1"
});

async function main() {
    const response = await openai.responses.create({
        model: "qwen3.5-plus",
        input: "你能做些什么？"
    });

    // 获取模型回复
    console.log(response.output_text);
}

main();