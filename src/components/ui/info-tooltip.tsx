import Link from "next/link";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BsArrowUpRight } from "react-icons/bs";

const InfoTooltip: React.FC<
  React.PropsWithChildren<{ learnMore?: string }>
> = ({ learnMore, children }) => {
  return (
    <div className="group relative flex text-text-300">
      <AiOutlineQuestionCircle className="z-0" />
      <div
        className="absolute left-1/2 z-10 mx-auto hidden -translate-x-1/2 translate-y-[21px] border-x-[5px] border-b-[5px] border-x-transparent border-b-gray-800 
        transition-all group-hover:block"
      />
      <span
        className="absolute left-1/2 z-10 m-4 mx-auto hidden w-[15rem] -translate-x-1/2 
        translate-y-[10px] rounded-md bg-gray-800 py-2 px-3 text-sm
        text-gray-100 transition-all group-hover:block"
      >
        {children}
        {learnMore && (
          <div className="mt-2 flex w-full items-center justify-end">
            <Link
              className="flex items-center gap-2 border-b-[1px]"
              href={learnMore}
            >
              Learn more
              <BsArrowUpRight />
            </Link>
          </div>
        )}
      </span>
    </div>
  );
};

export default InfoTooltip;
