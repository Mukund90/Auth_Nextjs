"use server"

import { redirect } from "next/navigation";

export default  async function SigIn() {
  redirect('/sigin'); 
  return null; 
}
