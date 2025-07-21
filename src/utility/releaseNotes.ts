import { RELEASE_NOTES_URL } from "@/config/urls";
import axios from "axios";

export const fetchReleaseNotes = async (onFetchCB?:(data:{ version: string, changes: string[] } | null)=>void) => {
    try {
      const response = await axios.get(RELEASE_NOTES_URL);
      const notes = response?.data?.release_notes?.[0];
      if(onFetchCB){
        onFetchCB({
            version: notes?.version,
            changes: notes?.changes
        })
      }

    } catch (error) {
      console.error("Failed to fetch release notes:", error);
      if(onFetchCB){
        onFetchCB(null)
      }
    }
  }