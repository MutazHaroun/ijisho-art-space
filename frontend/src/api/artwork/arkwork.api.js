
import api from "../axios"; 

export const fetchAllArtworks = async () => {
    try {
        
        const response = await api.get("/gallery");
        return response.data;
    } catch (error) {
        console.error("Error fetching artworks:", error);
        throw error; 
    }
}