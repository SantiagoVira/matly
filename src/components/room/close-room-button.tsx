/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert";
import Button from "../ui/button";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import useWindowSize from "~/utils/useWindowSize";

const CloseRoomButton: React.FC<{ id: string | undefined }> = ({ id }) => {
  const router = useRouter();
  const ctx = api.useUtils();
  const { isMobile } = useWindowSize();
  const endGame = api.game.end.useMutation({
    onSuccess: async () => {
      await router.push("/");
      await ctx.invalidate();
      document.dispatchEvent(new Event("visibilitychange"));
    },
  });
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="font-medium text-rose-600">
          Close
          {isMobile ? "" : " Room"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will close the room for all players and all scores will be
            erased.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => await endGame.mutateAsync({ id: id ?? "" })}
          >
            Close Room
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CloseRoomButton;
