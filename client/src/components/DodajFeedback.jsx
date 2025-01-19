"use client";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DodajFeedback = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!text.trim()) {
      setErrorMessage("Tekst povratne informacije je obavezan.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await axios.post(
        "http://localhost:3000/feedback",
        { text },
        {
          withCredentials: true,
        }
      );
      setSuccessMessage("Feedback uspješno poslan.");
      setText("");
    } catch (error) {
      setErrorMessage("Došlo je do greške prilikom slanja feedbacka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="bg-gray-100">
        <CardHeader>
          <CardTitle>Dodaj Povratnu Informaciju</CardTitle>
          <CardDescription>Podijelite vaše mišljenje anonimno.</CardDescription>
        </CardHeader>
        <CardContent className="grid w-full gap-2">
          <Textarea
            placeholder="Napišite vaš feedback..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
          {successMessage && (
            <div style={{ color: "green" }}>{successMessage}</div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Slanje..." : "Pošalji"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DodajFeedback;
