<img alt="Pantry Pal Banner" src="https://ftb.org/wp-content/uploads/2021/03/BigModule_nutrition-blog.jpg">
  <h1 align="center">Pantry Pal</h1>
</a>

<p align="center">
  Upload a photo, discover recipes, and never waste food again!
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#how-it-works"><strong>How It Works</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#how-to-run"><strong>How to Run</strong></a> ·
  <a href="#challenges"><strong>Challenges</strong></a> ·
  <a href="#future-improvements"><strong>Future Improvements</strong></a>
</p>

<br/>

---

## Inspiration

As broke college students who hate wasting food, we wanted to create a tool that makes cooking easier, more accessible, and more affordable.

There have been many times we let food go bad in our fridge or pantry because we did not know what to make with it. Instead of scrolling endlessly through recipe websites, we wanted a faster and smarter solution. Pantry Pal was built to solve that problem.

---

## Features

- Upload a photo of groceries from your fridge or pantry  
- Automatically detect ingredients using computer vision  
- Edit and confirm detected ingredients  
- Generate AI powered recipes based on what you have  
- View ingredients you already have and ingredients you are missing  
- Add missing ingredients to a grocery list  
- Responsive and clean UI  

---

## How It Works

1. The user uploads an image of their groceries.
2. The image is sent to Roboflow for object detection.
3. Roboflow returns a list of detected ingredients.
4. The user can edit or confirm the ingredient list.
5. The confirmed ingredients are sent to Google Gemini.
6. Gemini generates structured recipe suggestions.
7. The application displays recipes with a breakdown of ingredients you have and ingredients you need.

This creates a seamless pipeline from image input to intelligent recipe output.

---

## Tech Stack

### Frontend
- Next.js  
- React  
- Tailwind CSS  
- shadcn/ui  
- Figma for UI and UX design  

### Backend
- Next.js API Routes  
- Vercel for hosting and deployment  

### AI and Computer Vision
- Roboflow for custom object detection  
- Ultralytics YOLO for initial experimentation  
- Google Gemini for recipe generation  

---

## Deploy to Vercel

Pantry Pal is deployed using Vercel.

To deploy your own version:

1. Push your project to GitHub.  
2. Connect the repository to Vercel.  
3. Add environment variables in the Vercel dashboard.  
4. Deploy.  

Vercel automatically handles builds and serverless API routing.

---

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pantry-pal.git
cd pantry-pal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env.local` file and add your API keys

```
ROBOFLOW_API_KEY=your_key
GEMINI_API_KEY=your_key
```

### 4. Start the development server

```bash
npm run dev
```

Open your browser and navigate to:

```
http://localhost:3000
```

---

## Challenges

One major challenge was selecting the right image detection approach. We initially experimented with Ultralytics YOLO but encountered limitations in dataset coverage and detection accuracy for groceries. After testing and iteration, we transitioned to Roboflow, which allowed us to retrain a custom model tailored to our use case.

We also faced challenges integrating features through GitHub collaboration. We improved our workflow by adopting a structured branching strategy and reviewing pull requests before merging.

---

## Accomplishments

- Built our first full stack web application  
- Trained and deployed a custom grocery detection model  
- Designed and iterated our UI in Figma  
- Successfully integrated computer vision with generative AI  

---

## Future Improvements

- Improve ingredient detection accuracy  
- Expand supported grocery classes  
- Detect ingredient quantities  
- Integrate grocery pricing APIs  
- Add user accounts and saved recipes  
- Include links to recipe demonstration videos  
