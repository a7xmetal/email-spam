const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
let natural = require("natural");
let classifier = new natural.BayesClassifier();

const data = require("./spam.json");
let trained_data = require("./trained_data.json");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
   "595692067156-eadr3oij29mb0doc7trql8a27ta7l7v4.apps.googleusercontent.com"
);

app.use(bodyParser.json());
app.use(cors());

app.post("/api/google-login", async (req, res) => {
   const ticket = await client.verifyIdToken({
      idToken: req.body.token,
   });

   res.status(200).json(ticket.getPayload());
});

app.post("/train", async (req, res) => {
   data.forEach((item) => {
      classifier.addDocument(item.Message, item.Category);
   });

   classifier.train();

   classifier.save("trained_data.json", function (err, classifier) {});
});

app.post("/classify", async (req, res) => {
   // console.log(req.body);
   const emails = req.body.emails;
   // console.log(emails);
   // console.log("ff");
   const filtered_email = [];
   // classfier.classify(
   //             //    "You are gradually invited to the meeting of the company at 6 "
   //             // );

   // if (emails) {
   //    natural.BayesClassifier.load(
   //       "trained_data.json",
   //       null,
   //       function (err, classfier) {
   //          emails.forEach((email) => {
   //             let id = email.id;
   //             let spamCheck = classfier.classify(email.body);
   //             const obj = {};
   //             obj.id = id;
   //             obj.spam = spamCheck === "spam" ? true : false;
   //             filtered_email.push(obj);

   //          });
   //       }
   //    );
   // }
   if (emails) {
      const classifier = await new Promise((resolve) => {
         natural.BayesClassifier.load(
            "trained_data.json",
            null,
            function (err, classifier) {
               resolve(classifier);
            }
         );
      });

      emails.forEach((email) => {
         const obj = {};

         obj.id = email.id;
         obj.firstName = email.firstName;
         obj.lastName = email.lastName;
         obj.toEmail = email.toEmail;
         obj.subject = email.subject;
         obj.body = email.body;
         obj.hasViewed = email.hasViewed;
         obj.createdAt = email.createdAt;
         let spamCheck = classifier.classify(email.body);

         obj.spam = spamCheck === "spam" ? true : false;
         filtered_email.push(obj);
      });
   }
   console.log(filtered_email);
   res.status(200).json(filtered_email);
});

app.listen(4001, () => {
   console.log(`Server is ready at http://localhost:${4001}`);
});
