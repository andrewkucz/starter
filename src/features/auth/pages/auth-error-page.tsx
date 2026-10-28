import { CircleAlert } from "lucide-react";
import { Link, useSearch } from "@tanstack/react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getAuthErrorMessage } from "../error/messages";

export function AuthErrorPage() {
  const search = useSearch({ strict: false });
  const errorCode = typeof search.error === "string" ? search.error : null;
  const errorDescription =
    typeof search.error_description === "string" ? search.error_description : null;

  return (
    <Card className="max-w-sm w-full gap-4">
      <CardContent>
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            <p>{getAuthErrorMessage(errorCode)}</p>
            {errorDescription ? <p>{errorDescription}</p> : null}
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/sign-in">Back to sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
