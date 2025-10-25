export type Profile = {
  user_id: string;
  role: "manager" | "viewer" | null;
  created_at: string;
};
