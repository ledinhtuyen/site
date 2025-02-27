"use client";

import { useEffect, useState } from "react";
import { use } from "react"; // Import use from react

import Profile from "@components/Profile";
import axios from "axios";
import { useTranslation } from "@hooks/useTranslation";

const UserProfile = ({ params }) => {
  const { t } = useTranslation();
  const [myEmail, setMyEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    fetch(`/api/user/email`)
      .then((res) => res.json())
      .then((data) => setMyEmail(data.email || t('no_email')));
  }, []);

  const [userPrompts, setUserPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  const unwrappedParams = use(params); // Unwrap params

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      const { data } = await axios.get(`/api/user/${unwrappedParams?.id}/prompts`);

      if (!data) setLoading(true);

      setLoading(false);
      setUserPrompts(data);
      setUserEmail(decodeURIComponent(unwrappedParams?.id));
    };

    if (unwrappedParams?.id) fetchPrompts();
  }, [unwrappedParams?.id]);

  return (
    <Profile
      email={myEmail}
      name={userEmail}
      desc={t('profile.user_welcome_message', { user: userEmail })}
      data={userPrompts}
      loading={loading}
    />
  );
};

export default UserProfile;
