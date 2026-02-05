import { AxiosInstance } from "axios";
import { Profile, ProfileStats } from "@/lib/types/profileTypes";

export class ProfileService {
  constructor(private client: AxiosInstance) {}

  async getProfile(): Promise<Profile> {
    return this.client.get("/profile").then((r) => r.data);
  }

  async getProfileStats(): Promise<ProfileStats> {
    return this.client.get("/profile/stats").then((r) => r.data);
  }

  async uploadResume(resume: File, autofill: boolean): Promise<void> {
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("autofill", autofill.toString());

    return this.client
      .put("/profile/resume", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => r.data);
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    return this.client.patch("/profile", profile).then((r) => r.data);
  }
}
