"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useTranslation } from "@hooks/useTranslation";

const MyProfile = () => {
  const { t, locale } = useTranslation();
  const [myEmail, setMyEmail] = useState("");

  useEffect(() => {
    fetch(`/api/user/email`)
      .then((res) => res.json())
      .then((data) => setMyEmail(data.email || t('no_email')));
  }, []);

  const router = useRouter();

  const [myPrompts, setMyPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      const { data } = await axios.get(`/api/user/${myEmail}/prompts`);

      if (!data) setLoading(true);

      setLoading(false);
      setMyPrompts(data);
    };

    if (myEmail) fetchPrompts();
  }, [myEmail]);

  const handleEdit = (prompt) => {
    router.push(`/${locale}/update-prompt?id=${prompt.id}`);
  };

  const handleOpen = (action) => {
    if (action === true && selectedPrompt) {
      confirmDelete(selectedPrompt);
    }
    setOpen(!open);
  };

  const handleDelete = async (prompt) => {
    setSelectedPrompt(prompt);
    setOpen(true);
  };

  const confirmDelete = async (prompt) => {
    try {
      await axios.delete(`/api/prompt/${prompt.id.toString()}`);

      const filteredPrompts = myPrompts?.prompts?.filter((item) => item.id !== prompt.id);

      setMyPrompts(filteredPrompts);
      toast.success(t('toast.delete_success'));
    } catch (error) {
      console.log(error);
      toast.error(t('toast.delete_error'));
    }
  };

  return (
    <>
      <Profile
        name={t('profile.my_name')}
        desc={t('profile.welcome_message')}
        email={myEmail}
        data={myPrompts}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        loading={loading}
      />
      <Dialog
        open={open}
        size="xs"
        handler={handleOpen}
      >
        <DialogBody>
          {t('profile.delete_confirmation')}
        </DialogBody>
        <DialogFooter>
          <div className="mr-2">
            <Button
              variant="gradient"
              color="red"
              onClick={() => handleOpen(true)}
            >
              <span>{t('profile.button.yes')}</span>
            </Button>
          </div>
          <Button
            variant="text"
            color="red"
            onClick={() => handleOpen(false)}
            className="mr-1"
          >
            <span>{t('profile.button.no')}</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default MyProfile;
