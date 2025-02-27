"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@hooks/useTranslation";

import PromptCard from "./PromptCard";
import axios from "axios";
import Spinner from "./Spinner";

const PromptCardList = ({ email, data, handleTagClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((prompt) => (
        <PromptCard
          key={prompt.id}
          email={email}
          prompt={prompt}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const { t } = useTranslation();
  const [allPrompts, setAllPrompts] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Search states
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/prompt/all");
      setAllPrompts(data);
    } catch (error) {
      window.location.reload();
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmail = async () => {
    try {
      const { data } = await axios.get("/api/user/email");
      setEmail(data.email);
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  }

  useEffect(() => {
    fetchPosts();
    fetchEmail();
  }, []);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
    return allPrompts.filter(
      (item) =>
        regex.test(item.creator) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleTagClick = (tagName) => {
    // setSearchText(tagName);

    // const searchResult = filterPrompts(tagName);
    // setSearchedResults(searchResult);
  };

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder={t('search_placeholder')}
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>

      {/* All Prompts */}
      {searchText ? (
        <PromptCardList
          email={email}
          data={searchedResults}
          handleTagClick={handleTagClick}
        />
      ) : loading ? (
        <Spinner />
      ) : (
        <PromptCardList email={email} data={allPrompts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
