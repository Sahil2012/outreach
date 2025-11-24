import { Request, Response } from "express";
import { supabase } from "../apis/supabaseClient.js";
import { getAuth } from "@clerk/express";

// GET /referrals
export const getReferrals = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
      .from("referrals")
      .select(`
        *,
        companies (
          name,
          industry
        ),
        employees (
          name,
          position,
          is_hr
        )
      `)
      .eq("user_id", clerkUserId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// POST /referrals
export const createReferral = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { company_id, employee_id, template_type, email_content, status } = req.body;

    const { data, error } = await supabase
      .from("referrals")
      .insert({
        user_id: clerkUserId,
        company_id,
        employee_id,
        template_type,
        email_content,
        status: status || "pending",
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
