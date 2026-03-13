---
inclusion: always
---

### 2.3 表单页模板（Form Page）

适用场景：患者入院登记、医嘱开立、检查申请、处方录入等表单录入页面。

#### Block 拆分方案

| Block 名称 | 职责 | 文件路径 |
|------------|------|----------|
| FormHeader | 表单标题、描述、面包屑导航 | `blocks/FormHeader.tsx` |
| FormBody | HISFormLayout 表单主体（字段较多时拆分为子 Block） | `blocks/FormBody.tsx` |
| FormFooter | 提交、取消、保存草稿按钮 | `blocks/FormFooter.tsx` |

> 当 FormBody 超过 200 行时，按业务分组拆分为子 Block，例如：
> - `BasicInfoSection.tsx`：基本信息区
> - `DiagnosisSection.tsx`：诊断信息区
> - `OrderSection.tsx`：医嘱信息区

#### 推荐组件列表

- `HISFormLayout`：表单布局容器（`columns={2} density="compact"`）
- `Form`、`FormField`、`FormItem`、`FormLabel`、`FormControl`、`FormMessage`：表单组件（shadcn/ui + react-hook-form）
- `Input`：文本输入框
- `Select`、`SelectTrigger`、`SelectContent`、`SelectItem`：下拉选择
- `Button`：操作按钮
- `Card`：表单容器

#### 数据流定义

```
FormHeader ──(静态内容，无数据流)
FormBody ──(formState: FormValues)──→ react-hook-form 管理
FormFooter ──(触发 form.handleSubmit)──→ FormBody
```

- FormBody 内部使用 `react-hook-form` 管理表单状态
- FormFooter 通过 `form.handleSubmit` 触发表单提交
- 表单验证由 `react-hook-form` + `zod` 处理
- 页面入口通过 `FormProvider` 共享表单实例

#### 代码示例

```tsx
// pages/patient-admission/PatientAdmissionPage.tsx
import { FormHeader } from "./blocks/FormHeader";
import { FormBody } from "./blocks/FormBody";
import { FormFooter } from "./blocks/FormFooter";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

export function PatientAdmissionPage() {
  const form = useForm<AdmissionFormValues>();

  const onSubmit = (data: AdmissionFormValues) => {
    // 提交入院登记
  };

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="p-4 flex flex-col gap-4">
        <FormHeader title="入院登记" description="请填写患者入院信息" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormBody form={form} />
            <FormFooter
              onCancel={() => history.back()}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

---

---

⬅️ [详情页模板](./template-detail.md) | [返回目录](./index.md) | [仪表盘页模板](./template-dashboard.md) ➡️
