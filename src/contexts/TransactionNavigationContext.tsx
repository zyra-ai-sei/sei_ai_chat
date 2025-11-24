import React, { createContext, useContext, useState, useCallback } from "react";

interface TransactionNavigationContextType {
  scrollToTransaction: (chatIndex: number, txnIndex: number) => void;
  highlightedTransaction: string | null;
  clearHighlight: () => void;
}

const TransactionNavigationContext = createContext<
  TransactionNavigationContextType | undefined
>(undefined);

export const TransactionNavigationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [highlightedTransaction, setHighlightedTransaction] = useState<
    string | null
  >(null);

  const scrollToTransaction = useCallback(
    (chatIndex: number, txnIndex: number) => {
      const elementId = `txn-${chatIndex}-${txnIndex}`;
      const element = document.getElementById(elementId);

      if (element) {
        // Scroll to the element with smooth behavior
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Highlight the transaction
        setHighlightedTransaction(elementId);

        // Clear highlight after 3 seconds
        setTimeout(() => {
          setHighlightedTransaction(null);
        }, 3000);
      }
    },
    []
  );

  const clearHighlight = useCallback(() => {
    setHighlightedTransaction(null);
  }, []);

  return (
    <TransactionNavigationContext.Provider
      value={{ scrollToTransaction, highlightedTransaction, clearHighlight }}
    >
      {children}
    </TransactionNavigationContext.Provider>
  );
};

export const useTransactionNavigation = () => {
  const context = useContext(TransactionNavigationContext);
  if (!context) {
    throw new Error(
      "useTransactionNavigation must be used within TransactionNavigationProvider"
    );
  }
  return context;
};
