import Link from "next/link";

const HowToLink: React.FC = () => (
  <p className="mt-2">
    Check out how to play{" "}
    <Link className="text-hightlight underline" href="/how-to">
      here
    </Link>
    !
  </p>
);

export default HowToLink;
