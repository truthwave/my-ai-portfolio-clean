# 🧠 Prompt Portfolio

> Preserve the “trace of your thoughts” in tangible form.
> Simple and scalable. Supabase × Next.js.

<p align="center">
<img width="1536" height="1024" alt="プロンプト (1)" src="https://github.com/user-attachments/assets/5bd04e24-62f2-4c9d-a2c9-73aacab70dac" />
</p>

---

## Why Build It

Prompts aren't disposable.
They're a history of creation. They're assets.

This app is a portfolio for turning your thoughts into assets.
Discard complexity, keep only what matters.

---

## Experience

- Centralized prompt management
- Save outputs (text / images) linked to prompts
- Intuitive tag-based categorization
- One-click shareable URL generation
That's it. But it's enough.

---

## 🖼 Screenshot
![Dashboard Screen](https://github.com/user-attachments/assets/2b357ac1-cdfb-4b78-945b-6c51bd2acbe3)

Tag-based classification and output image previews all on one screen.

---

## How to Use (Up and Running in 3 Minutes)

### Prerequisites

* Node.js and npm must be installed

### Steps

1. Create a Supabase project
2. Set the following in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

---

## Inside

- Stack: Next.js (App Router) / Supabase (Auth, DB, Storage, RLS) / Tailwind CSS
- Models: prompts ↔ tags (many-to-many), prompt → results (1:N)
- Security: User-specific data isolation via RLS, flexible publishing with signed URLs
Beautiful structure exists within the code.

---

## Capabilities (Minimal Yet Sufficient)
- Create/Edit/Delete / Detail View / Dashboard List
- Create Tags / Assign Multiple Tags / Filter Search
- Save Output Text / Upload Images (Supabase Storage)
- Share Securely via Public URL / Signed URL

---

## Documents
#### [Slides](https://github.com/truthwave/my-ai-portfolio-clean/blob/main/English/Materials/Prompt%20Portfolio.pdf)

---

## License

MIT License

---

## 🧑‍💻 Creator

[True Wave](https://github.com/truthwave)
Also sharing info on AI tools and portfolio development.

## Feel Free to Contact Us
[📩 Inquiries & Quotes](mailto:realmadrid71214591@gmail.com)

---

> Design is a battle of how much you can strip away.

Make “Prompt Portfolio” the new standard for prompt management.
