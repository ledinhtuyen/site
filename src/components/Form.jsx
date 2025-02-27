import Link from "next/link";
import { useTranslation } from "@hooks/useTranslation";

const Form = ({ type, prompt, setPrompt, submitting, handleSubmit }) => {
  const { t } = useTranslation();

  return (
    <section className='w-full max-w-full flex-start flex-col'>
      <h1 className='head_text text-left'>
        <span className='blue_gradient'>{t(`${type}_prompt`)}</span>
      </h1>
      <p className='desc text-left max-w-md'>
        {t(`${type}_description`)}
      </p>

      <form
        onSubmit={handleSubmit}
        className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism'
      >
        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            {t('your_ai_prompt')}
          </span>

          <textarea
            value={prompt.prompt}
            onChange={(e) => setPrompt({ ...prompt, prompt: e.target.value })}
            placeholder={t('write_your_prompt_here')}
            required
            className='form_textarea '
          />
        </label>

        <label>
          <span className='font-satoshi font-semibold text-base text-gray-700'>
            {t('field_of_prompt')}{" "}
            <span className='font-normal'>
              ({t('example_tags')})
            </span>
          </span>
          <input
            value={prompt.tag}
            onChange={(e) => setPrompt({ ...prompt, tag: e.target.value })}
            type='text'
            placeholder={t('tag_placeholder')}
            required
            className='form_input'
          />
        </label>

        <div className='flex-end mx-3 mb-5 gap-4'>
          <Link href='/' className='text-gray-500 text-sm'>
            {t('Cancel')}
          </Link>

          <button
            type='submit'
            disabled={submitting}
            className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white'
          >
            {submitting ? `${t(`${type}ing`)}...` : t(type)}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
