import { env } from "@/env";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { NextResponse } from "next/server";
import { getSignedUrlForS3Object } from "@/lib/s3";

const functions = [
    {
        name: "create_auction",
        description: "Create a new auction",
        parameters: {
            type: "object",
            startingPrice: { type: "number"},
            duration: { type: "number"}
        },
        required: ["title", "startingPrice", "duration"],
    },
    {
        name: "place_bid",
        description: "Place a bid on an auction",
        parameters: {
            type: "object",
            auctionId: { type: "string"},
            bidAmount: { type: "number"}
        },
        required: ["auctionId", "bidAmount"],
    }
]

type AuctionStep = 'name' | 'type' | 'startingPrice' | 'location' | 'model' | 'description' | 'fileName' | 'endDate' | 'specs';

type AuctionDetails = {
    [key in AuctionStep]?: string | number | Date | any;
}

const auctionSteps: AuctionStep[] = [
    'name',
    'type',
    'startingPrice',
    'location',
    'model',
    'description',
    'fileName',
    'endDate',
    'specs'
];

const equipmentTypes = [
    'General',
    'Earthmoving',
    'Material Handling',
    'Compaction',
    'Road Consruction',
    'Concrete Equipment'
]

export async function POST(request: Request ) {
    try {
        const { message, userId, auctionDetails } = await request.json();

        if(message.toLowerCase() === 'create auction' || auctionDetails){
            return handleCreateAuction(message, userId, auctionDetails as AuctionDetails | null);
        }

        const chatModel = new ChatOpenAI({
            model:'mixtral-8x7b-32768',
            openAIApiKey: env.GROQ_API_KEY,
            configuration:{
                baseURL: "https://api.groq.com/openai/v1"
            }
        })

        const prompt = ChatPromptTemplate.fromTemplate(`
            Welcome to Constrauction. I will be your guide. Please type anything
            User's message: {question}
        `)

                
        const chain = prompt.pipe(chatModel);

        const response = await chain.invoke({
            question: message,
        });


        return NextResponse.json({ response: response.content })
      
    } catch (error) {
        console.error("Error in API handler:", error);
        return NextResponse.json({ error: 'An error occured while processing your request' }, { status: 500 });
    }
}

async function handlePlaceBid(){
    return NextResponse.json({
        response: 'You have placed a bid',
    })
}

async function handleCreateAuction(message:string, userId: string, auctionDetails: AuctionDetails | null = null){
    console.log(auctionDetails);
    if(!auctionDetails || Object.keys(auctionDetails).length === 0){
        auctionDetails = {};

        if(message.toLowerCase() === "create auction"){
            return NextResponse.json({
                response: "Great! Let's create an auction. Please enter the name of the item you're auctioning",
                auctionDetails: auctionDetails
            })
        }
    }
    const currentStep = auctionSteps.find(step => !(step in (auctionDetails)));

    if(!currentStep){
        // const fileUrl = await getSignedUrlForS3Object(auctionDetails.fileName as string);
        const specs = perpareSpecs(auctionDetails.type as string, auctionDetails.specs);

        return NextResponse.json({
            response: `Auction for ${auctionDetails.name} has been created successfully`,
            auctionComplete: true,
        })
    }

    auctionDetails[currentStep] = processInput(currentStep, message)
    

    const nextPrompt = getNextPrompt(currentStep, auctionDetails);
    
    return NextResponse.json({
        response: nextPrompt,
        auctionDetails: auctionDetails
    });
}

function processInput(step: string, input: string){
    switch(step){
        case 'name':
        case 'location':
        case 'model':
        case 'description':
        case 'fileName':
            return input.trim();
        case 'type':
            return equipmentTypes.find(type => type.toLowerCase() === input.toLowerCase()) || null;
        case 'startingPrice':
            return parseFloat(input);
        case 'endDate':
            return new Date(input);
        case 'specs':
            return JSON.parse(input);
        default:
            return null;
    }
}

function getNextPrompt(currentStep: string, auctionDetails: AuctionDetails){
    switch(currentStep){
        case 'name':
            return 'Enter the name of the item you are auctioning:';
        case 'type':
            return `Enter the type of the item you are auctioning (${equipmentTypes.join(', ')}):`;
        case 'startingPrice':
            return 'Enter the starting price of the auction:';
        case 'location':
            return 'Enter the location of the auction:';
        case 'model':
            return 'Enter the model of the equipment:';
        case 'description':
            return 'Provide a description of the item:';
        case 'fileName':
            return 'Enter the file name of the image:'
        case 'endDate':
            return 'Enter the end date of the auction? Please use (YYYY-MM-DD) format:'
        case 'specs':
            return getSpecsPrompt(auctionDetails.type);
        default:
            return 'All details collected. Creating auction...';
    }
}

function getSpecsPrompt(type: string){
    switch(type){
        case 'General':
            return "Enter the specs of the item (JSON format): {\"enginePower\": \"...\", \"weight\": \"...\", \"dimensions\": \"...\" }"
        case 'Earthmoving':
            return "Enter the specs of the item (JSON format): {\"diggingDepth\": \"...\", \"bucketCapacity\": \"...\", \"dumpHeight\": \"...\", \"reach\": \"...\" }"
        case 'Material Handling':
            return "Enter the specs of the item (JSON format): {\"liftCapacity\": \"...\", \"liftHeight\": \"...\", \"mastType\": \"...\" }"
        case 'Compaction':
            return "Enter the specs of the item (JSON format): {\"operatingWeight\": \"...\", \"vibrationFrequency\": \"...\", \"plateSize\": \"...\" }"
        case 'Road Consruction':
            return "Enter the specs of the item (JSON format): {\"pavingWidth\": \"...\", \"hopperCapacity\": \"...\", \"engineSpeed\": \"...\" }"
        case 'Concrete Equipment':
            return "Enter the specs of the item (JSON format): {\"drumCapacity\": \"...\", \"mixingSpeed\": \"...\", \"pumpCapacity\": \"...\" }"
        default:
            return "Enter the specs of the item (JSON format): {\"...\": \"...\"}"
    }
}

function perpareSpecs(type: string, specsString: string){
    const specsObj = JSON.parse(specsString);
    switch(type){
        case 'General':
            return{
                enginePower: specsObj.enginePower,
                weight: specsObj.weight,
                dimensions: specsObj.dimensions
            };
        case 'Earthmoving':
            return{
                diggingDepth: specsObj.diggingDepth,
                bucketCapacity: specsObj.bucketCapacity,
                dumpHeight: specsObj.dumpHeight,
                reach: specsObj.reach
            };
        case 'Material Handling':
            return{
                liftCapacity: specsObj.liftCapacity,
                liftHeight: specsObj.liftHeight,
                mastType: specsObj.mastType
            };
        case 'Compaction':
            return{
                operatingWeight: specsObj.operatingWeight,
                vibrationFrequency: specsObj.vibrationFrequency,
                plateSize: specsObj.plateSize
            };
        case 'Road Consruction':
            return{
                pavingWidth: specsObj.pavingWidth,
                hopperCapacity: specsObj.hopperCapacity,
                engineSpeed: specsObj.engineSpeed
            };
        case 'Concrete Equipment':
            return{
                drumCapacity: specsObj.drumCapacity,
                mixingSpeed: specsObj.mixingSpeed,
                pumpCapacity: specsObj.pumpCapacity
            };
        default:
            throw new Error("Invalid equipment type")
    }
}