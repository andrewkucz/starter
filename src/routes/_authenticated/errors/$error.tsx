import { createFileRoute } from "@tanstack/react-router";

import { ForbiddenError } from "@/features/errors/pages/forbidden-error-page";
import { GeneralError } from "@/features/errors/pages/general-error-page";
import { MaintenanceError } from "@/features/errors/pages/maintenance-error-page";
import { NotFoundError } from "@/features/errors/pages/not-found-error-page";
import { UnauthorisedError } from "@/features/errors/pages/unauthorized-error-page";

const errorMap: Record<string, React.ComponentType> = {
  unauthorized: UnauthorisedError,
  forbidden: ForbiddenError,
  "not-found": NotFoundError,
  "internal-server-error": GeneralError,
  "maintenance-error": MaintenanceError,
};

export const Route = createFileRoute("/_authenticated/errors/$error")({
  component: AuthenticatedErrorPage,
});

function AuthenticatedErrorPage() {
  const { error } = Route.useParams();
  const ErrorComponent = errorMap[error] ?? NotFoundError;
  return (
    <div className="flex-1 [&>div]:h-full">
      <ErrorComponent />
    </div>
  );
}
