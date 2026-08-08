import React, { useState, useRef, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { send, hardwareChip, helpCircleOutline } from "ionicons/icons";
import { askFoodSafetyQuestion, type ChatMessage } from "../../services/aiService";
import { t, getLanguage } from "../../utils/i18n";

export default function FoodSafetyBot() {
  const lang = getLanguage();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const contentRef = useRef<HTMLIonContentElement | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    // Wait for the DOM to update before scrolling
    setTimeout(() => {
        contentRef.current?.scrollToBottom(300);
    }, 100);
  }, [messages, loading]);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: question.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    const response = await askFoodSafetyQuestion(userMessage.content, messages);
    
    if (response.error) {
       setMessages([...newMessages, { role: "assistant", content: `❌ ${response.error}` }]);
    } else if (response.answer) {
       setMessages([...newMessages, { role: "assistant", content: response.answer }]);
    }

    setLoading(false);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': 'linear-gradient(135deg, #159947 0%, #0f7a36 100%)', '--color': 'white' } as React.CSSProperties}>
          <IonTitle>{t("chatTitle", lang)}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} style={{ '--background': '#f8fafc' } as React.CSSProperties}>
        <div className="flex flex-col gap-4 p-4 pb-8">
          {/* Welcome Message */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-start">
               <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex items-start gap-3">
                 <div className="bg-green-100 p-2 rounded-full mt-1 shrink-0">
                   <IonIcon icon={hardwareChip} className="text-green-700 text-xl" />
                 </div>
                 <div>
                    <p className="text-gray-800 leading-relaxed text-[15px] m-0">
                      {t("chatWelcome", lang)}
                    </p>
                 </div>
               </div>
            </div>

          </div>

          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div key={index} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[15px] leading-relaxed flex items-start gap-3 ${
                    isUser 
                      ? "bg-green-600 text-white rounded-tr-none" 
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {!isUser && (
                     <div className="bg-green-100 p-2 rounded-full mt-1 shrink-0">
                       <IonIcon icon={hardwareChip} className="text-green-700 text-xl" />
                     </div>
                  )}
                  <div className={isUser ? "pt-1 m-0" : "pt-1.5 whitespace-pre-wrap m-0"}>
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex justify-start">
               <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-full shrink-0">
                   <IonIcon icon={hardwareChip} className="text-green-700 text-xl" />
                 </div>
                 <div className="flex items-center gap-2">
                   <IonSpinner name="dots" className="text-green-600" />
                   <span className="text-sm text-gray-500 font-medium">{t("botTyping", lang)}</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      </IonContent>

      <IonFooter className="ion-no-border">
        {messages.length === 0 && (
          <IonAccordionGroup
            className="bg-white border-t border-gray-100 rounded-t-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.03)]"
          >
            <IonAccordion value="suggestions" className="bg-transparent">
              <IonItem 
                slot="header" 
                lines="none" 
                className="[--background:transparent] [--min-height:48px]"
                style={{ '--background-hover': 'transparent', '--background-activated': 'transparent', '--background-focused': 'transparent' } as React.CSSProperties}
              >
                <IonIcon icon={helpCircleOutline} slot="start" className="text-green-600 text-[20px] mr-3" />
                <IonLabel className="text-green-700 font-semibold text-[15px]">{t("smartSuggestions", lang)}</IonLabel>
              </IonItem>
              <div slot="content" className="px-4 pb-3 flex flex-col gap-2 bg-white">
                <div 
                  className="bg-gray-50 text-gray-700 text-[14px] py-3 px-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  onClick={() => {
                    setQuestion(t("chatExample1", lang));
                  }}
                >
                  {t("chatExample1", lang)}
                </div>
                <div 
                  className="bg-gray-50 text-gray-700 text-[14px] py-3 px-4 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  onClick={() => {
                    setQuestion(t("chatExample2", lang));
                  }}
                >
                  {t("chatExample2", lang)}
                </div>
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        )}
        <IonToolbar style={{ '--background': 'white', borderTop: messages.length > 0 ? '1px solid #f1f5f9' : 'none' } as React.CSSProperties}>
          <div className="flex items-center gap-2 p-2">
            <IonInput
              value={question}
              onIonInput={(e) => setQuestion(e.detail.value ?? "")}
              placeholder={t("chatPlaceholder", lang)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              mode="md"
              style={{
                '--background': '#f1f5f9',
                '--border-radius': '20px',
                '--padding-start': '16px',
                '--padding-end': '16px',
                '--placeholder-color': '#94a3b8',
                '--color': '#334155',
                minHeight: '44px',
                fontSize: '15px'
              } as React.CSSProperties}
            />
            <IonButton
              fill="clear"
              onClick={handleSend}
              disabled={loading || !question.trim()}
              style={{
                '--color': 'var(--color-primary)',
                margin: 0,
                width: '44px',
                height: '44px'
              } as React.CSSProperties}
            >
              <IonIcon icon={send} slot="icon-only" className="text-xl" />
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
}
