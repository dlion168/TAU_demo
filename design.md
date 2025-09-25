# Website Information Architecture (IA)

**Language:** English (for reviewers)
**GitHub Link:** `https://github.com/dlion168/TAU_demo`

---

## 1. `/index.html` (Homepage)

### **Paper Information**

* **Paper Title**
* **Authors**
* **Affiliations**

### **Introduction (Two Paragraphs)**

* **What is TAU?** The motivation and significance of evaluating **local non-semantic sound recognition** (designed to prevent accurate answers based solely on speech transcripts). *Content should draw from the paper's Abstract or Introduction.*
* **Dataset Snapshot:** Key statistics, including the number of audio files, the total number of questions, and a brief introduction to the sound categories (e.g., **Transit, Retail, Media, Emergency**, etc.).

### **Call-to-Action (CTA)**

* **Button: "View Leaderboard"** → Links to `/leaderboard.html`
* **Button: "Download Data & Instructions"** → Links to the external data download page (the homepage will only feature selected examples, not the full dataset).

### **Citation**

* **Cite our paper:** Include an **MLA format citation** and an **ArXiv BibTeX** entry.

---

## 2. `/examples.html` (Examples)

This page presents examples using a **Card format**:

Each card will include:

* **Title:** e.g., "Taipei Metro Arrival Alert Tone"
* **Audio Clip:** An `<audio controls>` element for playing the sound (under 30 seconds).
* **Cultural Context:** A single sentence explaining the cultural context of the sound.
* **Question Type & Category:** The corresponding Multiple-Choice Question (MCQ) type (**Single-hop / Multi-hop**) and its category.

**Card Footer:**

* **Link: "Full Dataset and Download"** → Directs to the external data download page.

---

## 3. `/leaderboard.html` (Leaderboard)

### **Human Topline**

* This information will be a fixed row at the top for comparison:
    * **Single-hop** $\approx 84\%$
    * **Multi-hop** $\approx 83\%$

### **Search and Submission**

* **Search Bar:** For fuzzy searching by **Model Name**.
* **Submission Instructions:** Instructions on how to submit results: "Contact the authors to discuss your submission."

### **Leaderboard Table Columns**

The data table must be sortable/filterable by these columns:

* **Model**
* **Params (B)**
* **Single-hop Acc** (Accuracy)
* **Multi-hop Acc** (Accuracy)
* **Submission Date**

---

## 4. `/about.html` (About)

### **Design Principles and Data Flow**

* An explanation of TAU's design principles and data pipeline, as described in the paper: **Concept Collection** $\rightarrow$ **Recording/Licensing** $\rightarrow$ **Question Generation and Review** $\rightarrow$ **Transcript Leakage Check**.

### **Data Statistics Summary**

* A summary using simple `<img>` elements to display charts/visuals:
    * Audio Length Distribution
    * Question Type Distribution

### **Contact the Authors**

* Provide the email addresses for the master student (you) and your professor.