const express = require('express');
const router = express.Router();
const Conversation = require('../schema/Conversation');
const User = require('../schema/User');







router.post('/', async(req, res) => {
    try {
        const {senderId, receiverId} = req.body;
        const existingConversation = await Conversation.findOne({members: {$all: [senderId, receiverId]}});
        if(existingConversation) {
            return res.status(200).json({message: 'Conversation already exists', conversation: existingConversation});
        }
        const newConversation = new Conversation({
            members: [senderId, receiverId]
        })
        const savedConversation = await newConversation.save();
        res.status(200).json({message: 'Conversation created successfully', savedConversation});
    } catch (err) {
        res.status(500).json({message: 'Error creating conversation', err});
    }
})

router.get('/:userId', async(req, res) => {
    try {
        const {userId} = req.params;
        const conversations = await Conversation.find({members: {$in: [userId]}});
        const conversationList = await Promise.all(conversations.map(async(conversation) => {
            const receiverId = conversation.members.find(id => id !== userId);
            const user =  await User.findById(receiverId);
            return {
                id: conversation._id,
                receiverId:user._id,
                name: user.name,
                bio: user.bio,
                image: user.image,
                lastMessage: conversation.lastMessage || ''
            }
        }))
        //console.log(conversationList);
        res.status(200).json({message: 'Conversations fetched successfully',  conversationList});
    } catch (err) {
        res.status(500).json({message: 'Error fetching conversations', err});
    }
})




module.exports = router;



/*

// Enhanced function to select radio buttons
function selectOption(questionText, optionValue) {
  // Find all elements containing the question text
  const elements = Array.from(document.querySelectorAll('*')).filter(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    const searchText = questionText.trim().replace(/\s+/g, ' ');
    return text.includes(searchText) || searchText.includes(text);
  });

  elements.forEach(el => {
    // Find the closest container
    const container = el.closest('tr, div, li, p, table, form, label') || el.parentElement;
    if (!container) return;

    // Find all radio buttons in this container
    const radios = container.querySelectorAll('input[type="radio"]');
    if (!radios || radios.length === 0) return;

    // Find the radio button with matching value or label
    let found = false;
    radios.forEach(radio => {
      const radioLabel = (radio.nextSibling?.textContent?.trim() || 
                         radio.parentElement.textContent.trim()).replace(/\s+/g, ' ');
      
      if (radio.value.toLowerCase() === optionValue.toLowerCase() || 
          radioLabel.includes(optionValue) ||
          radio.parentElement.textContent.includes(optionValue)) {
        radio.click();
        found = true;
      }
    });

    if (!found) {
      console.log(`Option "${optionValue}" not found for question "${questionText}"`);
    }
  });
}

// Robust function to fill text areas
function fillTextArea(searchText, content) {
  // Try multiple ways to find the textarea
  let textarea = null;
  
  // First try: Look for textarea with matching name or id
  textarea = document.querySelector(`textarea[name*="${searchText.split(' ')[0]}"], 
                                   textarea[id*="${searchText.split(' ')[0]}"]`);
  
  // Second try: Find label or text containing the search text
  if (!textarea) {
    const elements = Array.from(document.querySelectorAll('*')).filter(el => {
      const text = el.textContent.trim().replace(/\s+/g, ' ');
      return text.includes(searchText) || searchText.includes(text);
    });

    elements.forEach(el => {
      if (!textarea) {
        // Check next element
        textarea = el.nextElementSibling?.tagName === 'TEXTAREA' ? el.nextElementSibling : null;
        // Check parent's next sibling
        if (!textarea && el.parentElement) {
          textarea = el.parentElement.nextElementSibling?.querySelector('textarea');
        }
        // Check within the same container
        if (!textarea) {
          const container = el.closest('tr, div, li, p, table, form');
          if (container) {
            textarea = container.querySelector('textarea');
          }
        }
      }
    });
  }

  // Third try: Find by position if exactly 3 textareas exist
  if (!textarea) {
    const allTextareas = document.querySelectorAll('textarea');
    if (allTextareas.length === 3) {
      if (searchText.includes('Strength')) textarea = allTextareas[0];
      else if (searchText.includes('Weakness')) textarea = allTextareas[1];
      else if (searchText.includes('Suggestions')) textarea = allTextareas[2];
    }
  }

  if (textarea) {
    textarea.value = content;
    console.log(`Successfully filled textarea for "${searchText}"`);
  } else {
    console.log(`Textarea not found for "${searchText}" - please fill manually`);
  }
}

// Feedback responses - all set to Excellent where appropriate
const feedbackResponses = {
  "Knowledge of the teacher in the subject area": "Excellent",
  "Contribution of this laboratory in improving overall understanding of the subject": "Excellent",
  "Contribution of this laboratory in developing experimental / analytical / programming skills": "Excellent",
  "Encouraging and responding to student's questions in the class": "Excellent",
  "Quality of assignments and experiments": "Excellent",
  "Quality of evaluation": "Excellent",
  "Timely and helpful feedback": "Excellent",
  "Friendliness and approachability of the teacher": "Excellent",
  "Facilities available in laboratory for completion of design exercises / experiments": "Excellent",
  "Your effort in studying the course": "Average",
  "Workload of this course in comparison with other courses": "Heavy",
  "Knowledge and skills of teaching assistants": "Excellent",
  "6 Quality of evaluation": "Excellent",
  "7 Timely and helpful feedback": "Excellent",
  "8 Friendliness and approachability of the teacher": "Excellent",
  "10 Facilities available in laboratory": "Excellent",
  "11 Your effort in studying the course": "Average",
  "12 Workload of this course": "Heavy",
  "13 Knowledge and skills of teaching assistants": "Excellent"
};

// Your feedback text
const strengthsText = "The teacher demonstrated excellent subject knowledge and created a supportive learning environment. The laboratory sessions were well-structured and highly beneficial.";
const weaknessesText = "NIL";
const suggestionsText = "Weekly Tutorials";

// Fill all radio buttons
for (const [question, option] of Object.entries(feedbackResponses)) {
  selectOption(question, option);
}

// Fill text areas with multiple attempts
fillTextArea("Strength", strengthsText);
fillTextArea("Weakness", weaknessesText);
fillTextArea("Suggestions", suggestionsText);

// Alternative textarea fills if above didn't work
fillTextArea("Strength(10-50 words)", strengthsText);
fillTextArea("Weakness(10-50 words)", weaknessesText);
fillTextArea("14 Suggestions", suggestionsText);
// Direct textarea targeting based on known IDs from the form
try {
  document.getElementById("rad_1_9").value = strengthsText.trim();
  document.getElementById("rad_2_9").value = weaknessesText.trim();
  console.log("Strength and Weakness fields filled via ID targeting.");
} catch (err) {
  console.warn("Direct fill failed:", err);
}

console.log("Form auto-fill completed. All radio options set to Excellent where appropriate. Please verify all fields before submitting.");
*/

/*
function selectOption(questionText, optionValue) {
  const elements = Array.from(document.querySelectorAll('*')).filter(el => {
    const text = el.textContent.trim().replace(/\s+/g, ' ');
    const searchText = questionText.trim().replace(/\s+/g, ' ');
    return text.includes(searchText) || searchText.includes(text);
  });

  elements.forEach(el => {
    const container = el.closest('tr, div, li, p, table, form, label') || el.parentElement;
    if (!container) return;

    const radios = container.querySelectorAll('input[type="radio"]');
    if (!radios.length) return;

    let found = false;
    radios.forEach(radio => {
      const radioLabel = (radio.nextSibling?.textContent?.trim() ||
                         radio.parentElement.textContent.trim()).replace(/\s+/g, ' ');
      if (radio.value.toLowerCase() === optionValue.toLowerCase() ||
          radioLabel.includes(optionValue) ||
          radio.parentElement.textContent.includes(optionValue)) {
        radio.click();
        found = true;
      }
    });

    if (!found) {
      console.log(`Option "${optionValue}" not found for question "${questionText}"`);
    }
  });
}

// Responses
const feedbackResponses = {
  "Knowledge of the teacher in the subject area": "Excellent",
  "Stimulation of interest in the subject area": "Excellent",
  "Clarity of presentation and ease of understanding": "Excellent",
  "Pace / speed of teaching": "Just Right",
  "Encouraging and responding to student's questions in the class": "Excellent",
  "Quality of tests , assignments and tutorials": "Excellent",
  "Quality of evaluation": "Excellent",
  "Timely Feedback on student's performance": "Excellent",
  "Enthusiasm of the teacher towards the subject": "Excellent",
  "Friendliness and approachability of the teacher": "Excellent",
  "Your effort in studying the course": "Very Heavy",
  "Workload of this course in comparison with other courses": "Very Heavy"
};

// Fill radio buttons
for (const [question, option] of Object.entries(feedbackResponses)) {
  selectOption(question, option);
}

// Feedback Text
const strengthsText = "The teacher demonstrated excellent subject knowledge and created a supportive learning environment. The laboratory sessions were well-structured and highly beneficial.";
const strengthsText2 = "Wide range of applications in industry with relevant examples.";
const weaknessesText = "NIL";
const suggestionsText = "Weekly Tutorials";

// Direct textarea targeting based on IDs
try {
  document.getElementById("rad_1_11").value = strengthsText.trim();
  document.getElementById("rad_2_11").value = weaknessesText.trim();
  document.getElementById("rad_1_12").value = strengthsText2.trim();
  document.getElementById("rad_2_12").value = weaknessesText.trim();
  document.getElementById("rad_0_15").value = "Weekly Tutorials";
  console.log("Strength and Weakness fields filled via ID targeting.");
} catch (err) {
  console.warn("Direct fill failed:", err);
}

console.log("Form auto-fill completed. All radio options set. Please review before submission.");


*/ 
