import {Request, Response} from "express";
import companyModel from "../models/Company";
export const AddCompany = async(req:Request, res:Response) => {
  const {compName, reviewURL, email, about, compURL, companyId} = req.body;
  console.log(compName, reviewURL, email, about, compURL)
  try {
    if(compName.trim() === "" || email.trim() === "" || compURL.trim() === ""){
      res.status(402).send("All fields are required");
      return ;
    }

    else{
      const newCompany = new companyModel({
        compName: compName, 
        reviewURL: reviewURL, 
        email: email, 
        companyId: companyId,
        about: about,
        compURL: compURL,
        reviews: []
      })
      
      console.log(newCompany)

      await newCompany.save();
      res.status(201).json({newCompany});
    } 
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
