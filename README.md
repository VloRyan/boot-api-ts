[![CI Workflow](https://github.com/VloRyan/boot-api-ts/actions/workflows/ci.workflow.yml/badge.svg)](https://github.com/VloRyan/boot-api-ts/actions/workflows/ci.workflow.yml)

![BootApiTS Logo](.github/assets/logo.png)

**BootApiTS** is a reusable UI component framework built with **TypeScript**, designed to work seamlessly with \*
\*Bootstrap** and optimized for **JSON:API-based\*\* applications.

The name is a playful nod to the classic "TS = Tomato + Salad" combo — bringing freshness and flavor to your frontend
stack.

---

## 🚀 Features

- ⚙️ **TypeScript-first** — fully typed and developer-friendly
- 🎨 **Bootstrap-compatible** — leverages Bootstrap’s grid & styling system
- 🔌 **JSON:API aware** — streamlined integration with structured APIs
- 🧩 **Reusable UI components** — build once, use everywhere
- 🔍 **Modular design** — import only what you need

---

## 📦 Installation

```shell
npm install https://github.com/VloRyan/boot-api-tsnpm install https://github.com/VloRyan/boot-api-ts
```

## 🛠️ Usage Example

```tsx
import { useResource, useResourceObjectForm, } from "@vloryan/boot-api-ts/hooks/";
import { useLocation } from "wouter";
import { ItemPage } from "@vloryan/boot-api-ts/pages/";
import { Container, Row } from "react-bootstrap";
import { ObjectForm } from "@vloryan/ts-jsonapi-form/form/";
import { BootstrapFieldFactory } from "@vloryan/boot-api-ts/components/fields/";

export function Page() {
  const [location] = useLocation();
  const { doc, isLoading, error, queryKey } = useResource(apiPath(location));
  const form = useResourceObjectForm({
    id: "form",
    document: doc,
    queryKey: queryKey,
    apiUrl: "https://my-api.local",
  });
  return (
    <ItemPage error={error} isLoading={isLoading} formId={form.id}>
      <form {...form.setup()}>
        <Editor form={form} />
      </form>
    </ItemPage>
  );
}

export const Editor = ({ form }: { form: ObjectForm }) => {
  const fields = new BootstrapFieldFactory(form);
  return (
    <Container fluid>
      <Row>
        <fields.Text label="Name" name="name" />
        <fields.Number label="Age" name="age" />
        <fields.TextArea label="Description" name="description" />
        <fields.Select
          label="Color"
          name="color"
          options={
            new Map([
              ["r", "Red"],
              ["g", "Green"],
              ["b", "Blue"],
            ])
          }
        />
      </Row>
    </Container>
  );
};
```

## 📌 Project Status

This library is currently in an **early development phase** and **not ready for production** use.  
Suggestions, feedback, and contributions are very welcome!

## 📄 License

This project is licensed under the **MIT License**.
