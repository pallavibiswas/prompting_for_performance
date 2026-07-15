# From Behind the Mind to Behind the Screen
 
An interactive research website exploring enterprise AI adoption, and prompt engineering.
 
The project was developed through the Rutgers IDEA program in collaboration with JPMorganChase. It presents research findings, interview insights, survey data, the CRAFT prompting framework, and an interactive research journey.
 
## Features
 
- Interactive AI word-cloud hero
- Research problem and project overview
- Behavioural and technical solution framework
- Survey dashboard with responsive charts
- Research insight cards
- Interview quote carousel
- Embedded research PDFs
- CRAFT prompt-building lab
- Interactive globe and research journey
- Responsive layouts for desktop, tablet, and mobile
- Markdown-driven content for easier editing


## Technology
 
- React
- TypeScript
- Vite
- CSS
- Tailwind CSS plugin
- GitHub Pages
- GitHub Actions


## Project Structure
 
```text
prompting-for-performance/
├── public/
│   ├── content/           # Editable Markdown content
│   ├── images/             # Globe textures and public images
│   └── pdfs/                 # Embedded research documents
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── components/        # React website sections
│   ├── hooks/                # Reusable React hooks
│   ├── lib/                    # Markdown parsing and shared definitions
│   ├── styles/               # Component CSS files
│   └── main.tsx
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── vite.config.ts
└── package.json
```
 
## Local Development
 
Install dependencies:
 
```bash
npm install
```
 
Start the development server:
 
```bash
npm run dev
```
 
Open the local URL shown by Vite, usually:
 
```text
http://localhost:5173/
```
 
## Production Build
 
Create a production build:
 
```bash
npm run build
```
 
The generated website is placed in:
 
```text
dist/
```
 
### Testing the Production Build Locally
 
The production build uses the GitHub Pages base path:
 
```text
/prompting_for_performance/
```
 
Because of this, running `vite preview` directly may not correctly resolve the production asset paths.
 
Use the following method instead:
 
```bash
rm -rf preview-root
mkdir -p preview-root/prompting_for_performance
cp -R dist/. preview-root/prompting_for_performance/
npx serve preview-root -l 4174
```
 
Then open:
 
```text
http://127.0.0.1:4174/prompting_for_performance/
```
 
> **Note:** Do not commit the temporary `preview-root` folder.
 
## GitHub Pages Deployment
 
The website is deployed automatically whenever changes are pushed to the `main` branch.
 
```bash
git add .
git commit -m "Update website"
git push origin main
```
 
The GitHub Actions workflow:
 
1. Installs dependencies
2. Builds the Vite project
3. Publishes the contents of `dist`
4. Pushes the production build to the `gh-pages` branch
GitHub Pages must be configured as:
 
| Setting | Value |
|---|---|
| Source | Deploy from a branch |
| Branch | `gh-pages` |
| Folder | `/` (root) |
 
The live website is available at:
 
**https://pallavibiswas.github.io/prompting_for_performance/**
 
### Important Deployment Notes
 
- Edit source files only on `main`.
- Do not manually edit files on the `gh-pages` branch.
The `gh-pages` branch contains generated production files such as:
 
```text
assets/index-ABC123.js
assets/index-XYZ789.css
```
 
These filenames are generated automatically and may change after every build.
 
Make all edits in the source files on `main`, then push the changes so GitHub Actions can rebuild the site.
 
### Vite Base Path
 
The repository name uses an underscore:
 
```text
prompting_for_performance
```
 
The Vite production base must therefore remain:
 
```ts
base:
 command === "build"
   ? "/prompting_for_performance/"
   : "/"
```
 
> **Warning:** Using a hyphen or `/` as the production base will cause a blank deployed page because the generated JavaScript and CSS paths will be incorrect.
 
### Verify a Deployment
 
Check the live HTML:
 
```bash
curl -s \
 "https://pallavibiswas.github.io/prompting_for_performance/?$(date +%s)" \
 | grep -E "script|stylesheet|assets"
```
 
The output should reference compiled assets such as:
 
```text
/prompting_for_performance/assets/index-ABC123.js
```
 
It should **not** reference:
 
```text
/src/main.tsx
```
 
## Editing Content
 
Much of the website content is stored in Markdown files under:
 
```text
public/content/
```
 
Examples include:
 
- `cloud-words.md`
- `solutions.md`
- `survey-data.md`
- `insight-cards.md`
- `interview-quotes.md`
- `craft-examples.md`
- `journey-map.md`
Content can usually be updated without modifying the React component logic.
 
After editing Markdown content, rebuild and redeploy the website normally.
 
## Styling
 
Each major section has its own stylesheet in:
 
```text
src/styles/
```
 
Examples include:
 
- `Hero.css`
- `Problem.css`
- `Solutions.css`
- `SurveyHub.css`
- `ResearchInsights.css`
- `QuotesCarousel.css`
- `CRAFTLab.css`
- `GlobeMap.css`
Responsive styles are defined using media queries for desktop, tablet, mobile, and smaller phone layouts.
 
## Contributors
 
Website developed by **Pallavi Biswas** as part of the Rutgers IDEA × JPMorganChase Summer 2026 Global Design Research Fellowship.

Content developed by other cohort members: Adam Wilson, Anthony Panucchi, Faith Hu, Graham Walter, Imania Mohammed, Jack Adams, Jessica Faltas

