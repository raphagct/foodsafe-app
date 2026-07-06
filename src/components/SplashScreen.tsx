function SplashScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-[#f0f0f0] fixed top-0 left-0 z-[99999] animate-[splash-fade-in_0.4s_ease-out]">
      <div className="flex flex-col items-start leading-[0.9] animate-[splash-scale-in_0.5s_cubic-bezier(0.16,1,0.3,1)]">
        <span className="font-black text-[72px] text-black tracking-[-2px]">
          Food
        </span>
        <span className="font-black text-[72px] text-[#159947] tracking-[-2px]">
          Safe.
        </span>
      </div>
    </div>
  );
}

export default SplashScreen;
