"use client";

import Btn from "../ui/Btn";

function NotFoundBtn() {
  return <Btn text="Back" onclick={() => window.history.back()} />;
}

export default NotFoundBtn;
