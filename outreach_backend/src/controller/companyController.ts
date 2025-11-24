import { Request, Response } from "express";
import { supabase } from "../apis/supabaseClient.js";
import { getAuth } from "@clerk/express";

// GET /companies
export const getCompanies = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("name");

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /companies
export const createCompany = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { name, industry, website } = req.body;

    const { data, error } = await supabase
      .from("companies")
      .insert([{ name, industry, website }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// GET /companies/:companyId/employees
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { companyId } = req.params;

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("company_id", companyId)
      .order("name");

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /companies/:companyId/employees
export const createEmployee = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { companyId } = req.params;
    const { name, email, linkedin_url, position, is_hr } = req.body;

    const { data, error } = await supabase
      .from("employees")
      .insert([{ 
        company_id: companyId,
        name, 
        email, 
        linkedin_url, 
        position, 
        is_hr 
      }])
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /companies/get-or-create
export const getOrCreateCompany = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { name } = req.body;

    // Check if company exists
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("name", name)
      .maybeSingle();

    if (existingCompany) {
      return res.json(existingCompany);
    }

    // Create new company
    const { data: newCompany, error } = await supabase
      .from("companies")
      .insert({ name })
      .select("id")
      .single();

    if (error) throw error;
    res.json(newCompany);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /companies/:companyId/employees/get-or-create
export const getOrCreateEmployee = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { companyId } = req.params;
    const { name } = req.body;

    // Check if employee exists
    const { data: existingEmployee } = await supabase
      .from("employees")
      .select("id")
      .eq("company_id", companyId)
      .eq("name", name)
      .maybeSingle();

    if (existingEmployee) {
      return res.json(existingEmployee);
    }

    // Create new employee
    const { data: newEmployee, error } = await supabase
      .from("employees")
      .insert({ company_id: companyId, name })
      .select("id")
      .single();

    if (error) throw error;
    res.json(newEmployee);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
