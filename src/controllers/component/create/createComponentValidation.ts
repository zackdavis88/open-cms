import { validateName } from 'src/controllers/utils';
import { Blueprint } from 'src/models';
import { validateContent } from 'src/controllers/component/utils';

type CreateComponentValidation = (input: {
  blueprint: Blueprint;
  nameInput?: unknown;
  contentInput?: unknown;
}) => { name: string; content: Record<string, unknown> };

const createComponentValidation: CreateComponentValidation = ({
  blueprint,
  nameInput,
  contentInput,
}) => {
  const name = validateName({ name: nameInput }) as string;
  const content = validateContent({ blueprint, content: contentInput }) as Record<
    string,
    unknown
  >;

  return { name, content };
};

export default createComponentValidation;
