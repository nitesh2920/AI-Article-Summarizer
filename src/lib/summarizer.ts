import axios from  'axios';

export async function summarizeArticle(articleUrl: string){
    const options ={
        method:"GET",
        url:"https://ai-article-summarizer-and-summarizer.p.rapidapi.com/summarize",
        params:{
            url:articleUrl,
            summarize:"true"
        },
        headers:{
            "X-RapidAPI-key":process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "",
            "X-RapidAPI-Host":"ai-article-summarizer-and-summarizer.p.rapidapi.com",
        },

    };

    try{
        const response = await axios.request(options);
        return response.data;
    }catch(error){
        console.error("Error summarizing article:", (error as Error).message);
        throw new Error("Failed to summarize article");

    }


}

