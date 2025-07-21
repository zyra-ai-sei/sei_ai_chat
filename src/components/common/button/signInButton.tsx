import WalletIcon from "@/assets/header/wallet.svg?react";

function SignInButton() {
  return (
    <button
      type="button"
      className="rounded-[90px] bg-primary-main-500 px-[20px] py-[16px] text-neutral-greys-0 typo-b1-semiBold flex items-center gap-x-[8px]"
    >
      <span>Sign In</span>
      <WalletIcon className="h-[24px] w-[24px]" />
    </button>
  );
}

export default SignInButton;
