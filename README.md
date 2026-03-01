<a href="https://demo-nextjs-with-supabase.vercel.app/">
  <img alt="Next.js and Supabase Starter Kit - the fastest way to build apps with Next.js and Supabase" src="https://i.insider.com/65cceb986fcb546d2d4fadaf?width=800&format=jpeg&auto=webp">
  <h1 align="center">Pantry Pal</h1>
</a>

<p align="center">
 Take a photo of your fridge/pantry and generate recipes to reduce food waste! 
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#How-to-run"><strong>How to run</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>
Here is the full README in proper Markdown format so you can copy and paste it directly into your `README.md` file on GitHub:

````markdown
# 🥗 Pantry Pal

Pantry Pal is a full stack web application that helps users turn the food they already have into real recipes. By combining computer vision and generative AI, Pantry Pal allows users to upload a photo of groceries and instantly receive recipe suggestions based on detected ingredients.

---

## 💡 Inspiration

As broke college students who hate wasting food, we wanted to create a tool that makes cooking easier, more accessible, and more affordable.

There have been many times we let food go bad in our fridge or pantry because we did not know what to make with it. Instead of scrolling through recipe websites, we wanted a faster and smarter solution. Pantry Pal was built to solve that problem.

---

## 🍽️ What It Does

With Pantry Pal, users can:

- Upload a photo of groceries from their fridge or pantry  
- Select preferences such as cuisine type, cooking skill level, and available time  
- Automatically detect ingredients from the image  
- Receive AI generated recipes based on detected items  

Each recipe clearly displays:

- Ingredients you already have  
- Ingredients you are missing  
- Step by step instructions  

Users can also add missing ingredients to a grocery list for their next shopping trip.

---

## 🧠 How It Works

1. The user uploads an image of their groceries.
2. The image is sent to Roboflow for object detection.
3. Roboflow returns a list of detected ingredients.
4. The user can edit or confirm the ingredient list.
5. The confirmed ingredients are sent to Google Gemini.
6. Gemini generates structured recipe suggestions.
7. The application displays the recipes along with a breakdown of ingredients you have and ingredients you need.

This creates a smooth pipeline from image input to intelligent recipe output.

---

## 🛠️ Tech Stack

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

## 🚧 Challenges

One major challenge was selecting the right image detection approach. We initially experimented with Ultralytics YOLO, but encountered limitations in dataset coverage and detection accuracy for groceries. After testing and iteration, we transitioned to Roboflow, which allowed us to leverage open source datasets and retrain a custom model tailored to our use case.

We also faced challenges integrating features through GitHub collaboration. We improved our workflow by adopting a structured branching strategy and reviewing pull requests before merging.

---

## 🏆 Accomplishments

- Built our first full stack web application  
- Trained and deployed a custom grocery detection model  
- Designed and iterated the UI using Figma  
- Successfully integrated computer vision with generative AI  

---

## ⚙️ Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/pantry-pal.git
cd pantry-pal
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file and add your API keys:

```
ROBOFLOW_API_KEY=your_key
GEMINI_API_KEY=your_key
```

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and go to:

```
http://localhost:3000
```

---

## 🌍 Deployment

Pantry Pal is deployed using Vercel.

To deploy your own version:

1. Push your project to GitHub.  
2. Connect the repository to Vercel.  
3. Add environment variables in the Vercel dashboard.  
4. Deploy.  

Vercel handles build and serverless API routing automatically.

---

## 🔮 Future Improvements

- Improve ingredient detection accuracy  
- Expand the number of supported grocery classes  
- Detect ingredient quantities  
- Integrate grocery pricing APIs  
- Add user accounts and saved recipes  
- Include links to recipe demonstration videos  
