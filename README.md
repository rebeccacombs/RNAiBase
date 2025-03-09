![image](https://github.com/user-attachments/assets/33bd18be-ccc0-4fae-a5c4-8260b5849b58)
<div align="center">
<a href="https://rnaibase.vercel.app/" target="_blank"><img src="https://github.com/user-attachments/assets/a7ee18bd-260c-4ffb-9c4d-a50fc98c9755" width="50%" alt="RNAiBase Logo"></a>
</div>

# RNAiBase: An Interactive Platform for Bibliometric and Clinical Analysis Within the Field of RNA Interference

<br/>

<h3 align="center">Visit here: <a href="https://rnaibase.vercel.app/" target="_blank">https://rnaibase.vercel.app/</a></h3>

<br/>

## Running RNAiBase locally
This website was built using a [Next.js](https://nextjs.org/) app router, [Mantine](https://mantine.dev/) for CSS, and the [TypeScript](https://www.typescriptlang.org/) programming language. It can easily be cloned and run on any machine with [Node and npm](https://nodejs.org/en/download)  installed. If neither are, please download them by clicking on the hyperlink-- make sure to choose the correct Operating System (Windows/macOS/Linux) that is on your computer. 

### Steps: 
#### 1. Clone this repository either by downloading and extracting the `.zip` file, or by running this command in your terminal:
```\root
git clone https://github.com/rebeccacombs/RNAiBase.git
```
#### 2. Either in your IDE/text editor or from the terminal, enter the repository:
```
cd RNAiBase
```
#### 3. Once in the repository, otain all npm packages needed to run the project locally by running this command:
```
npm i
```
#### 4. Once complete, run locally with this command:
```
npm run dev
```
<br/>
You should be able to visit the website locally at http://localhost:3000/, or whatever port that is outputted from running the command in step 4.

## Website walkthrough

## Homepage

<div align="center"><img width="60%" alt="RNAiBase Homepage" src="https://github.com/user-attachments/assets/e918237b-281b-4829-9e0f-b9e531285788" /></div>

From the homepage, there are three subpages to traverse to: [Visualizations](https://rnaibase.vercel.app/visualizations), [Papers](https://rnaibase.vercel.app/papers), and [Clinical Trials](https://rnaibase.vercel.app/clinicaltrials). 


## Visualizations page
### Paper data visualizations
When first entering this page, you are greeted by visualizations to create for the paper data avaialble on the website. These visualizations were made primarily using the npm package [Recharts](https://recharts.org/). 

<div align="center"><img width="60%" alt="Paper data visualizations" src="https://github.com/user-attachments/assets/636f6a65-1f84-45df-b8ef-1488cebe24ed" /></div>


Users can filter and sort all the paper data through a multitude of filtering options, including visualization type, chart type, a limit of the results shown, and a date range. 

For visualization type within research paper visualizations, users can choose to visualize (1) top keywords, (2) journal distribution of academic papers, (3) top authors represented across all academic papers, and (4) the publication timeline distribution of all paper entries avaiable to view on the website. 

<div align="center"><img width="30%" alt="Paper visualization type" src="https://github.com/user-attachments/assets/c5ba12e3-391a-4bb0-85fc-fb5a5f3c2b32" /></div>


Users can choose between 3 different visualization types: bar chart, pie chart, and treemap. 
<div align="center"><img width="30%" alt="Paper visualization types" src="https://github.com/user-attachments/assets/d4edf3df-5626-47fb-adca-59727d5990a3" /></div>


Users can limit the results by however little or great they want, allowing for even more control over the final visualizations. 
<div align="center"><img width="30%" alt="Paper limits" src="https://github.com/user-attachments/assets/f259fb72-30a9-4cb1-afb0-1a97bd9e03ee" /></div>


Users can also create a date range of returned paper results, allowing for exploration of different distributions of these statistics depending on the chosen timeline. 
<div align="center"><img width="30%" alt="Paper date range picker" src="https://github.com/user-attachments/assets/c7c89fe7-1bd4-4d7f-a847-2e16b2d0dff1" />
<img width="30%" alt="Paper date range result" src="https://github.com/user-attachments/assets/460cac1d-c50e-4553-bc5f-e46e5d21ca0c" /></div>


If users hover over these visualizations, they are given the precise number for each area, which represents the number of papers which fall into that category. If clicked on, users will be greeted by the list of papers which fall into that category exactly. Users then have the option to click on any one of these papers to view their details even further. 
<div align="center"><img width="45%" alt="Paper visualization click on section" src="https://github.com/user-attachments/assets/5156bef5-4a78-4e62-b7b0-27e103099bb3" />
<img width="45%" alt="Paper visualization clicked-on paper" src="https://github.com/user-attachments/assets/d97d886b-10d4-49f1-8f36-573a8beddccb" /></div>

</br> 

### Clinical trial data visualizations
To the right of Research Papers, Clinical Trials can be clicked on, where users will be greeted with similar visualization filtering and sorting options for the six FDA-approved RNAi medications and their publicly available clinical trial data information. 
Users can filter and sort all the paper data through a multitude of filtering options, including visualization type, chart type, a limit of the results shown, a date range, and drug type to filter.
<div align="center"><img width="60%" alt="Clinical trial visualizations" src="https://github.com/user-attachments/assets/b6bca77b-07a5-4fce-9ecc-c29a29c1f74e" /></div>

 
For visualization type within research clinical trial visualizations, users can choose to visualize (1) trial phases, (2) trial status, (3) top sponsors, (4) trials timeline distribution, and (5) conditions studied of all clinical trial entries avaiable to view on the website. 
<div align="center"><img width="286" alt="Screenshot 2025-03-09 at 8 35 54 AM" src="https://github.com/user-attachments/assets/7e479d5e-8120-4d2c-8fac-df61aa6fa59f" /></div>


Like for the paper data visualizations, users can choose between 3 different visualization types, limit the data shown on the visualization, and customize a date range. 

Additionally, users can choose between 1 of the 6 drugs if they are interested in viewing any of these distributions for an available medication in particular. 
<div align="center"><img width="30%" alt="Clinical trial drug filtering" src="https://github.com/user-attachments/assets/e8ec8555-4de1-47bd-91d3-ccfd0653a647" /></div>


Also like the paper data visualizations, users can hover over the clinical trial data visualzations and be given a precise number for sed section. If clicked on, users will be greeted by the list of clinical trials which fall into that category exactly. Users then have the option to click on any one of these clinical trials to view their details even further. 
<div align="center"><img width="45%" alt="Clinical trial visualization hover" src="https://github.com/user-attachments/assets/4e6aef04-7171-4de2-9ab3-7939331cdfd9" />
<img width="45%" alt="Clinical trial visualization specific entry" src="https://github.com/user-attachments/assets/063c0867-c281-4368-bcdf-a69127d5ce79" /></div>

</br>

## Papers page

On the papers page, users will be greeted with all 549 RNAi papers available in the website's database, with the ability to traverse throuhgh all of them. All data was obtained from [PubMed](https://pubmed.ncbi.nlm.nih.gov/) using the npm package [pubmed-fetch](https://www.npmjs.com/package/pubmed-fetch) which I developed for this website. Users right off the bat can see information like the title, the PubMed ID (PMID), a few sentences of the abstract, keywords, publish data, authors, and the jorunal of publication. 
<div align="center"><img width="45%" alt="Papers page top" src="https://github.com/user-attachments/assets/c50d02d8-e0f9-48fc-a524-fb9b591f8e85" />
<img width="45%" alt="Papers page bottom" src="https://github.com/user-attachments/assets/770a4e09-6f68-4452-8979-f05a57f30f58" /></div>


This has robust searching and filtering capabilities, with search tips present for users to easily expand and learn how to use. Users can easily search for specific keywords and titles. 
<div align="center"><img width="60%" alt="Papers page search bar" src="https://github.com/user-attachments/assets/3da3e274-647f-42cd-822c-822e1c882996" /></div>


In the search bar, users can specify authors and immediately be returned results with that author, by entering `author:AUTHORNAME`. 
<div align="center"><img width="60%" alt="papers author search" src="https://github.com/user-attachments/assets/38e56cb3-e5e3-4772-8c54-8349df8a50e6" /></div>


Users can sort by newest, oldest, or title alphabetically. 
<div align="center"><img width="30%" alt="papers result sort" src="https://github.com/user-attachments/assets/a127e470-9cc8-4851-a70a-77156ad10bd7" /></div>


They can also filter by all journals represented in the papers within this website. 
<div align="center"><img width="30%" alt="papers filter by journal" src="https://github.com/user-attachments/assets/3d943da8-d20a-4595-bf55-56a8f96efc70" /></div>


Much like the visualizations, users can also filter paper results by a date range.
<div align="center"><img width="30%" alt="papers filter by date range" src="https://github.com/user-attachments/assets/6ab77b11-ce87-4cbc-8127-9acf3ab07ac4" /></div>


For each paper entry, users can click to view more information on any paper they are interested in within the database, similar to the capability on the visualizations page. 
<div align="center"><img width="60%" alt="Papers page individual entry exampe" src="https://github.com/user-attachments/assets/905ddbbf-9614-4776-8cc6-556bcd93a3ad" /></div>

</br>

## Clinical Trials page
When this page is first clicked on, users are greeted by the 6 FDA approved RNAi medications, with the number of clinical trials for each underneath the name that a user may click on to learn more about.
<div align="center"><img width="60%" alt="Clinical trials page" src="https://github.com/user-attachments/assets/7f3e1c43-7164-4fa5-bdba-826deeafc888" /></div>

Then, users can click on a particular drug, navigating to the subpage and being greeted with a brief drug information overview, including the primary gene this RNAi medication targets, the drug manufacturer, the mechanism of action, and a general description of the medication. This data was obtained from the [Food and Drug Administration](https://www.fda.gov/) using the [openFDA API](https://open.fda.gov/). 
<div align="center"><img width="60%" alt="Medication page overview" src="https://github.com/user-attachments/assets/c5be40bf-f0a5-4eb6-9d6d-32bb6a3180e4" /></div>

For each clinical trial listed under the medication, this data includes status, phase, conditions focused on for the trial, the National Clinical Trial ID (NCTID), the number of participants enrolled, the primary outcome, the start and end dates, and the list of locations this clinical trial took place in. This data was obtained from [ClinicalTrials.gov](https://clinicaltrials.gov/) with their [free to use API](https://clinicaltrials.gov/data-api/api). 
<div align="center"><img width="60%" alt="Medication page specific clinical trial" src="https://github.com/user-attachments/assets/4432ac8d-ff6f-4c79-b786-30fc9d27cd1a" /></div>

</br> 

## Website footer: user experience questionnaire
Here, there is a hyperlink to a user experience google form that users may fill out if they are interested in sharing their experience with the website as well as provide feedback if they have any. It is available on any page on the site. There are a total of 20 questions, only 10 being required to complete the form, and 12 being multiple choice with the remaining 8 being long answer. 
<div align="center"><img width="45%" alt="footer" src="https://github.com/user-attachments/assets/5d0ef0b8-602d-4579-87d3-976a9ffcbc65" />
<img width="45%" alt="google form" src="https://github.com/user-attachments/assets/35f8bdfa-4d4a-4000-a8c7-f074d21d5a67" /></div>


The form can be accessed [here](https://forms.gle/1NHXpsvyXJ17aFNo7). 

</br>

## Contributions
Given this project is open source, issues will always be checked and pull requests available for anyone in the open source web development community interested in this project to contribute towards. Thank you for your interest in RNAiBase!

<i>-- Rebecca and Chesney.</i> 
