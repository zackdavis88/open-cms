import { validateUsername, validatePassword } from 'src/controllers/user/validationUtils';

type CreateUserValidation = ({
  usernameInput,
  passwordInput,
}: {
  usernameInput: unknown;
  passwordInput: unknown;
}) => Promise<{ username: string; password: string }>;

const createUserValidation: CreateUserValidation = async ({
  usernameInput,
  passwordInput,
}) => {
  const username = await validateUsername(usernameInput);
  const password = validatePassword(passwordInput);

  return { username, password };
};

export default createUserValidation;
