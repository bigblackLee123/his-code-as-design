#!/usr/bin/env node

/**
 * HIS UI 代码质量检查脚本
 * 
 * 功能：
 * - 检查 Design Token 合规性（颜色、间距、字号）
 * - 检查组件使用规范
 * - 检查数据脱敏
 * - 检查文件行数限制
 * - 检查内联样式和自定义 CSS 类
 * 
 * 用法：
 *   node scripts/his-lint.js <file-path>
 *   node scripts/his-lint.js src/pages/doctor-terminal/blocks/PatientInfoBar.tsx
 */

import fs from 'fs';
import path from 'path';

// 配置
const CONFIG = {
  maxLines: 200,
  allowedColors: [
    // 品牌色
    'primary-50', 'primary-100', 'primary-200', 'primary-300', 'primary-400',
    'primary-500', 'primary-600', 'primary-700', 'primary-800', 'primary-900',
    // 辅助色
    'secondary-50', 'secondary-100', 'secondary-200', 'secondary-300', 'secondary-400',
    'secondary-500', 'secondary-600', 'secondary-700', 'secondary-800', 'secondary-900',
    // 语义色
    'success-50', 'success-100', 'success-200', 'success-300', 'success-400',
    'success-500', 'success-600', 'success-700', 'success-800', 'success-900',
    'warning-50', 'warning-100', 'warning-200', 'warning-300', 'warning-400',
    'warning-500', 'warning-600', 'warning-700', 'warning-800', 'warning-900',
    'error-50', 'error-100', 'error-200', 'error-300', 'error-400',
    'error-500', 'error-600', 'error-700', 'error-800', 'error-900',
    'info-50', 'info-100', 'info-200', 'info-300', 'info-400',
    'info-500', 'info-600', 'info-700', 'info-800', 'info-900',
    // 中性色
    'neutral-50', 'neutral-100', 'neutral-200', 'neutral-300', 'neutral-400',
    'neutral-500', 'neutral-600', 'neutral-700', 'neutral-800', 'neutral-900',
    // HIS 状态色
    'his-admitted', 'his-inHospital', 'his-discharged', 'his-critical',
    'his-pending', 'his-executing', 'his-completed', 'his-cancelled',
    // 基础色
    'white', 'black', 'transparent', 'current',
  ],
  allowedSpacing: ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'],
  allowedFontSizes: ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'],
  sensitiveFields: ['patientName', 'name', 'idNumber', 'idCard', 'identityNumber', 'phone', 'mobile', 'tel', 'contactNumber'],
};

// 检查结果
const results = {
  errors: [],
  warnings: [],
  info: [],
};

function checkFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在: ${filePath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // 检查 1: 文件行数
  checkLineCount(lines, filePath);

  // 检查 2: 内联样式
  checkInlineStyles(content, lines, filePath);

  // 检查 3: 自定义 CSS 类
  checkCustomClasses(content, lines, filePath);

  // 检查 4: 颜色令牌
  checkColorTokens(content, lines, filePath);

  // 检查 5: 间距令牌
  checkSpacingTokens(content, lines, filePath);

  // 检查 6: 字号令牌
  checkFontSizeTokens(content, lines, filePath);

  // 检查 7: 数据脱敏
  checkDataMasking(content, lines, filePath);

  // 检查 8: 第三方 UI 库
  checkThirdPartyLibs(content, lines, filePath);

  // 输出结果
  outputResults(filePath);
}

function checkLineCount(lines, filePath) {
  if (lines.length > CONFIG.maxLines) {
    results.errors.push({
      type: 'line-count',
      severity: 'error',
      message: `文件超过 ${CONFIG.maxLines} 行限制`,
      file: filePath,
      line: lines.length,
      suggestion: `当前 ${lines.length} 行，建议拆分为多个子 Block 组件`,
    });
  }
}

function checkInlineStyles(content, lines, filePath) {
  const styleRegex = /style\s*=\s*\{\{/g;
  let match;
  while ((match = styleRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    const lineContent = lines[lineNum - 1].trim();
    results.errors.push({
      type: 'inline-style',
      severity: 'error',
      message: '禁止使用内联样式',
      file: filePath,
      line: lineNum,
      code: lineContent,
      suggestion: '使用 Tailwind CSS 工具类替代内联样式',
    });
  }
}

function checkCustomClasses(content, lines, filePath) {
  // 检查是否有自定义 CSS 类（非 Tailwind 工具类）
  const classRegex = /className\s*=\s*["'`]([^"'`]+)["'`]/g;
  let match;
  while ((match = classRegex.exec(content)) !== null) {
    const classes = match[1].split(/\s+/);
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    classes.forEach(cls => {
      // 跳过 Tailwind 工具类、cn() 函数、条件类名
      if (cls.includes(':') || cls.includes('[') || cls.includes('$') || cls.includes('{')) {
        return;
      }
      
      // 检查是否为自定义类名（不以 Tailwind 前缀开头）
      const tailwindPrefixes = [
        'flex', 'grid', 'block', 'inline', 'hidden', 'visible',
        'p-', 'm-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-',
        'gap-', 'space-',
        'w-', 'h-', 'min-', 'max-',
        'text-', 'font-', 'leading-', 'tracking-',
        'bg-', 'border-', 'rounded-', 'shadow-',
        'hover:', 'focus:', 'active:', 'disabled:',
        'sm:', 'md:', 'lg:', 'xl:', '2xl:',
      ];
      
      const isTailwind = tailwindPrefixes.some(prefix => cls.startsWith(prefix));
      
      if (!isTailwind && cls.length > 2 && !cls.match(/^[a-z]+-[a-z]+$/)) {
        results.errors.push({
          type: 'custom-class',
          severity: 'error',
          message: `疑似自定义 CSS 类: "${cls}"`,
          file: filePath,
          line: lineNum,
          code: lines[lineNum - 1].trim(),
          suggestion: '仅使用 Tailwind CSS 工具类，避免自定义类名',
        });
      }
    });
  }
}

function checkColorTokens(content, lines, filePath) {
  // 检查任意颜色值 text-[#xxx] 或 bg-[#xxx]
  const arbitraryColorRegex = /(text|bg|border)-\[#[0-9a-fA-F]{3,6}\]/g;
  let match;
  while ((match = arbitraryColorRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    results.errors.push({
      type: 'arbitrary-color',
      severity: 'error',
      message: `使用了任意颜色值: ${match[0]}`,
      file: filePath,
      line: lineNum,
      code: lines[lineNum - 1].trim(),
      suggestion: '使用 Design Token 定义的颜色令牌，如 text-primary-500、bg-error-50',
    });
  }
}

function checkSpacingTokens(content, lines, filePath) {
  // 检查任意间距值 p-[13px] 或 m-[7px]
  const arbitrarySpacingRegex = /(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|gap)-\[\d+px\]/g;
  let match;
  while ((match = arbitrarySpacingRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    results.errors.push({
      type: 'arbitrary-spacing',
      severity: 'error',
      message: `使用了任意间距值: ${match[0]}`,
      file: filePath,
      line: lineNum,
      code: lines[lineNum - 1].trim(),
      suggestion: '使用 4px 网格体系的标准间距类，如 p-1、p-2、p-4',
    });
  }
}

function checkFontSizeTokens(content, lines, filePath) {
  // 检查任意字号值 text-[14px]
  const arbitraryFontSizeRegex = /text-\[\d+px\]/g;
  let match;
  while ((match = arbitraryFontSizeRegex.exec(content)) !== null) {
    const lineNum = content.substring(0, match.index).split('\n').length;
    
    // 允许 text-[10px]（辅助字号）
    if (match[0] === 'text-[10px]') {
      continue;
    }
    
    results.warnings.push({
      type: 'arbitrary-font-size',
      severity: 'warning',
      message: `使用了任意字号值: ${match[0]}`,
      file: filePath,
      line: lineNum,
      code: lines[lineNum - 1].trim(),
      suggestion: '使用标准字号类，如 text-xs、text-sm、text-base',
    });
  }
}

function checkDataMasking(content, lines, filePath) {
  // 检查敏感字段是否使用了 MaskedText 组件
  CONFIG.sensitiveFields.forEach(field => {
    const fieldRegex = new RegExp(`\\{[^}]*\\.${field}[^}]*\\}`, 'g');
    let match;
    while ((match = fieldRegex.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      const lineContent = lines[lineNum - 1];
      
      // 检查是否在 MaskedText 组件中
      if (!lineContent.includes('MaskedText')) {
        results.errors.push({
          type: 'data-masking',
          severity: 'error',
          message: `敏感字段 "${field}" 未使用 MaskedText 组件`,
          file: filePath,
          line: lineNum,
          code: lineContent.trim(),
          suggestion: `使用 <MaskedText type="name|idNumber|phone" value={${field}} />`,
        });
      }
    }
  });
}

function checkThirdPartyLibs(content, lines, filePath) {
  const forbiddenLibs = [
    { name: 'antd', pattern: /from\s+['"]antd['"]/ },
    { name: '@mui/material', pattern: /from\s+['"]@mui\/material['"]/ },
    { name: 'react-icons', pattern: /from\s+['"]react-icons/ },
    { name: '@ant-design/icons', pattern: /from\s+['"]@ant-design\/icons['"]/ },
  ];

  forbiddenLibs.forEach(({ name, pattern }) => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const lineNum = content.substring(0, match.index).split('\n').length;
      results.errors.push({
        type: 'third-party-lib',
        severity: 'error',
        message: `禁止引入第三方 UI 库: ${name}`,
        file: filePath,
        line: lineNum,
        code: lines[lineNum - 1].trim(),
        suggestion: '使用 shadcn/ui 组件和 lucide-react 图标',
      });
    }
  });
}

function outputResults(filePath) {
  const hasErrors = results.errors.length > 0;
  const hasWarnings = results.warnings.length > 0;

  // 静默模式：如果没有问题，不输出任何内容
  if (!hasErrors && !hasWarnings) {
    process.exit(0);
  }

  // 只在有问题时输出报告
  console.log('\n📊 HIS 代码质量检查报告\n');
  console.log(`文件: ${filePath}\n`);

  if (hasErrors) {
    console.log('❌ 错误 (必须修复):');
    results.errors.forEach((err, idx) => {
      console.log(`\n${idx + 1}. [${err.type}] ${err.message}`);
      console.log(`   位置: 第 ${err.line} 行`);
      if (err.code) {
        console.log(`   代码: ${err.code}`);
      }
      console.log(`   建议: ${err.suggestion}`);
    });
  }

  if (hasWarnings) {
    console.log('\n\n⚠️  警告 (建议修复):');
    results.warnings.forEach((warn, idx) => {
      console.log(`\n${idx + 1}. [${warn.type}] ${warn.message}`);
      console.log(`   位置: 第 ${warn.line} 行`);
      if (warn.code) {
        console.log(`   代码: ${warn.code}`);
      }
      console.log(`   建议: ${warn.suggestion}`);
    });
  }

  console.log('\n');
  
  // 输出 JSON 格式（供 AI 解析）
  console.log('--- JSON 报告 ---');
  console.log(JSON.stringify({ 
    file: filePath,
    errors: results.errors, 
    warnings: results.warnings 
  }, null, 2));

  process.exit(hasErrors ? 1 : 0);
}

// 主函数
const filePath = process.argv[2];
if (!filePath) {
  console.error('用法: node scripts/his-lint.js <file-path>');
  process.exit(1);
}

checkFile(filePath);
