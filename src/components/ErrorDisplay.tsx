import NetworkError from '../errors/NetworkError';
import { formatValidationErrors } from '../util/validationUtils';

interface ErrorDisplayProps {
  errors: NetworkError | undefined | null;
}

export const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
  if (!errors) return null;
  console.error(errors);

  return (
    <>
      {errors.code && <p className="error-code">{errors.code}</p>}
      {errors.message && <p className="error-message">{errors.message}</p>}
      {errors.errors && (
        <ul className="error-messages">
          {formatValidationErrors(errors.errors).map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}
    </>
  );
};
