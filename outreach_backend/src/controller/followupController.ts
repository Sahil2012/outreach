import { Request, Response } from "express";
import { supabase } from "../apis/supabaseClient.js";
import { getAuth } from "@clerk/express";

// GET /followups
export const getFollowups = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { data, error } = await supabase
      .from("followups")
      .select(`
        *,
        referrals!inner (
          user_id,
          companies (
            name
          ),
          employees (
            name
          )
        )
      `)
      .eq("referrals.user_id", clerkUserId)
      .order("followup_date", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /followups/:id
export const updateFollowup = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from("followups")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /followups/:id
export const deleteFollowup = async (req: Request, res: Response) => {
  try {
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;

    const { error } = await supabase
      .from("followups")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ message: "Followup deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
