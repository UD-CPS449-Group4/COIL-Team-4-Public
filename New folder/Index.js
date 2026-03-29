const express=require('express')
const app = express()
var port = process.env.PORT || 8080;
app.use(express.urlencoded({extended: false}))
app.use(express.json())
const cors =require('cors')
app.use(cors())
app.listen(port, ()=>
    console.log("Express server is running on port " + port))

app.get("/", (req,res)=>{
    res.send('Microservice Gateway by COIL Team 4')
})


app.post("/conversation", async (req,res) => {
    const messages = req.body.messages;
    if (!Array.isArray(messages)){
        return res.status(400).json({error: "your format is wrong"});
    }
    try{
        const response = await sendToAI(messages);
        res.json({response: response});
    }
    catch(error){
        res.json({response: messages});
    }
});

async function sendToAI(messages){
    //the form.html page uses leftover code from Personal Project 1 which constructs the message log 
    // following OpenAI message standards. its (hopefully) easier to reformat the message log here
    // than rebuild the sending and display logic in form.html
    const message = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content}]
    }));
    
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=IllMakeANewCode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
            contents: message
        })
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

}
