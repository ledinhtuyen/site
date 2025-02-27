import PromptCard from "./PromptCard";
import Spinner from "./Spinner";
import { useTranslation } from "@hooks/useTranslation";

const Profile = ({ email, name, desc, loading, data, handleEdit, handleDelete }) => {
  const { t } = useTranslation();

  return (
    <section className='w-full'>
      <h1 className='head_text text-left'>
        <span className='purple_gradient'>{name} {t('profile.title')}</span>
      </h1>
      <p className='desc text-left'>{desc}</p>

      <div className='mt-10 prompt_layout'>
        {loading ? (
          <Spinner />
        ) : (
          data?.prompts?.map((prompt) => (
            <PromptCard
              email={email}
              key={prompt.id}
              prompt={prompt}
              handleEdit={() => handleEdit && handleEdit(prompt)}
              handleDelete={() => handleDelete && handleDelete(prompt)}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Profile;
