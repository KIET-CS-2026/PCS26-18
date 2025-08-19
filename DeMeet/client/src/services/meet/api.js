import { MeetApi } from "@/lib/axios";

export const meetApi = {
  createRoom: (roomLocked = false, title = "Test Meeting") =>
    MeetApi.post("/rooms/create-room", {
      roomLocked: roomLocked,
      metadata: {
        title: title,
      },
    }),
};
