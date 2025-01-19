
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import Upute from "../components/Upute";
import DodajFeedback from "../components/DodajFeedback";

const FeedbackManager = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchFeedbacks = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.get("http://localhost:3000/feedback", {
        withCredentials: true,
      });
      setFeedbacks(response.data);
    } catch (error) {
      setErrorMessage("Došlo je do greške prilikom dohvaćanja feedbacka.");
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/feedback/${id}`, {
        withCredentials: true,
      });
      setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));
    } catch (error) {
      toast("Došlo je do greške prilikom brisanja feedbacka.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  return (
    <div className="space-y-4 mx-7">
      <Upute
        naslov="Anonimne poruke"
        opis={
          "Napišite što god želite; poruku, zahvalu kritiku... Ova poruka ni na kakav način nije vezana s vašim profilom, te je u potpunosti anonimna. Administrator ne vidi tko je što poslao, ali može brisati zastarjele i neprimjerene poruke."
        }
      ></Upute>
      <div className="space-y-8 mx-6">
        <DodajFeedback></DodajFeedback>
        <h2>Povratne informacije:</h2>
      </div>

      {loading && <p>Učitavanje...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {feedbacks.map((feedback) => (
        <Card key={feedback._id}>
          <CardHeader>
            <CardTitle>Povratna Informacija</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{feedback.text}</p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-gray-500">
            <span>{new Date(feedback.datum).toLocaleString()}</span>
            {userInfo?.uloga === "administrator" && (
              <Button
                variant="destructive"
                onClick={() => deleteFeedback(feedback._id)}
              >
                Ukloni
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default FeedbackManager;
