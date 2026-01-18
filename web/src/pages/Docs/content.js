/**
 * Default API documentation content
 * This content is used as fallback when API doesn't return documentation
 */

export const DEFAULT_DOCS_CONTENT = `# API 接口文档

## 概述

本文档描述了 LLaAPI 平台提供的 RESTful API 接口。所有 API 请求都应发送到服务器的基础 URL。

**Base URL**: \`https://your-domain.com/v1\`

## 认证

大多数 API 请求需要认证。请在请求头中包含 API Key：

\`\`\`http
Authorization: Bearer YOUR_API_KEY
\`\`\`

API Key 可以在控制台的"令牌管理"页面中创建和管理。

---

## 接口列表

### 1. 聊天完成 (Chat Completion)

发送聊天请求并获取模型回复。

**Endpoint**: \`POST /chat/completions\`

**请求头**:
\`\`\`
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
\`\`\`

**请求体**:
\`\`\`json
{
  "model": "gpt-4",
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}
\`\`\`

**响应示例**:
\`\`\`json
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4",
  "choices": [{
    "index": 0,
    "message": {
      "role": "assistant",
      "content": "Hello! I'm doing well, thank you for asking."
    },
    "finish_reason": "stop"
  }],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}
\`\`\`

**参数说明**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| model | string | 是 | 要使用的模型名称 |
| messages | array | 是 | 消息数组，包含对话历史 |
| temperature | number | 否 | 采样温度，范围 0-2，默认 1 |
| max_tokens | number | 否 | 生成的最大 token 数 |
| top_p | number | 否 | 核采样参数 |
| stream | boolean | 否 | 是否使用流式输出 |

---

### 2. 文本嵌入 (Text Embeddings)

将文本转换为向量嵌入。

**Endpoint**: \`POST /embeddings\`

**请求体**:
\`\`\`json
{
  "model": "text-embedding-ada-002",
  "input": "The food was delicious"
}
\`\`\`

**响应示例**:
\`\`\`json
{
  "object": "list",
  "data": [{
    "object": "embedding",
    "embedding": [0.002, -0.009, ...],
    "index": 0
  }],
  "model": "text-embedding-ada-002",
  "usage": {
    "prompt_tokens": 5,
    "total_tokens": 5
  }
}
\`\`\`

---

### 3. 图像生成 (Image Generation)

使用 DALL-E 或其他模型生成图像。

**Endpoint**: \`POST /images/generations\`

**请求体**:
\`\`\`json
{
  "model": "dall-e-3",
  "prompt": "A beautiful sunset over the ocean",
  "n": 1,
  "size": "1024x1024"
}
\`\`\`

**响应示例**:
\`\`\`json
{
  "created": 1677855123,
  "data": [{
    "url": "https://example.com/image.png"
  }]
}
\`\`\`

---

### 4. 获取模型列表

获取可用的模型列表。

**Endpoint**: \`GET /models\`

**响应示例**:
\`\`\`json
{
  "object": "list",
  "data": [
    {
      "id": "gpt-4",
      "object": "model",
      "created": 1677610602,
      "owned_by": "openai"
    }
  ]
}
\`\`\`

---

## 错误处理

API 使用标准 HTTP 状态码来表示请求的结果：

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 认证失败，API Key 无效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 429 | 请求频率过高 |
| 500 | 服务器内部错误 |

**错误响应格式**:
\`\`\`json
{
  "error": {
    "message": "Invalid API key",
    "type": "invalid_request_error",
    "code": "invalid_api_key"
  }
}
\`\`\`

---

## 速率限制

API 请求受速率限制控制，具体限制取决于您的账户类型和配置。当超过限制时，将返回 429 状态码。

响应头中包含速率限制信息：
\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
\`\`\`

---

## 流式响应

对于聊天完成接口，支持流式响应。在请求中设置 \`"stream": true\`，服务器将返回 Server-Sent Events (SSE) 格式的数据流。

**请求示例**:
\`\`\`json
{
  "model": "gpt-4",
  "messages": [...],
  "stream": true
}
\`\`\`

**流式响应示例**:
\`\`\`
data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"delta":{"content":"Hello"}}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","choices":[{"delta":{"content":"!"}}]}

data: [DONE]
\`\`\`

---

## 代码示例

### cURL

\`\`\`bash
curl https://your-domain.com/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
\`\`\`

### Python

\`\`\`python
import requests

headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

data = {
    "model": "gpt-4",
    "messages": [
        {"role": "user", "content": "Hello!"}
    ]
}

response = requests.post(
    "https://your-domain.com/v1/chat/completions",
    headers=headers,
    json=data
)

print(response.json())
\`\`\`

### JavaScript

\`\`\`javascript
const response = await fetch('https://your-domain.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-4',
    messages: [
      { role: 'user', content: 'Hello!' }
    ]
  })
});

const data = await response.json();
console.log(data);
\`\`\`

---

## 支持与反馈

如有问题或建议，请通过以下方式联系：

- 项目仓库: [GitHub](https://github.com/QuantumNous/new-api)
- 问题反馈: 在仓库中提交 Issue

---

**最后更新**: 2025年`;
