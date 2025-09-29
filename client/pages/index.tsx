import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { Member, RouterQuery } from "../types";

export default function MembershipApproval(): JSX.Element {
  const router = useRouter();
  const { member: memberParam, price, link }: RouterQuery = router.query;
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Function to convert Roman numerals to Arabic numbers
  const romanToArabic = (roman: string): number => {
    const romanNumerals: { [key: string]: number } = {
      I: 1,
      V: 5,
      X: 10,
      L: 50,
      C: 100,
      D: 500,
      M: 1000,
    };

    let result = 0;
    let prevValue = 0;

    // Process from right to left
    for (let i = roman.length - 1; i >= 0; i--) {
      const currentValue = romanNumerals[roman[i].toUpperCase()];

      if (currentValue === undefined) {
        throw new Error(`Invalid Roman numeral: ${roman[i]}`);
      }

      if (currentValue < prevValue) {
        result -= currentValue;
      } else {
        result += currentValue;
      }

      prevValue = currentValue;
    }

    return result;
  };

  // Function to parse member parameter: firstname_lastname_Roman Number
  const parseMemberParam = (
    memberString: string
  ): { name: string; num: string } => {
    try {
      const decoded = decodeURIComponent(memberString);

      // Split by underscore to get parts
      const parts = decoded.split("_");

      if (parts.length < 3) {
        throw new Error("Invalid member format");
      }

      // Get firstname and lastname (everything except the last part)
      const nameParts = parts.slice(0, -1);
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" "); // In case lastname has spaces

      // Capitalize first letter of first name and last name
      const capitalizeFirstLetter = (str: string): string => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      const capitalizedFirstName = capitalizeFirstLetter(firstName);
      const capitalizedLastName = capitalizeFirstLetter(lastName);

      // Get the Roman number (last part) and convert to Arabic
      const romanNumber = parts[parts.length - 1];
      const arabicNumber = romanToArabic(romanNumber);

      // Format name as "FirstName LastName"
      const fullName = `${capitalizedFirstName} ${capitalizedLastName}`;

      return {
        name: fullName,
        num: arabicNumber.toString(),
      };
    } catch (error) {
      console.error("Error parsing member parameter:", error);
      return {
        name: "Unknown Member",
        num: "N/A",
      };
    }
  };

  useEffect(() => {
    if (router.isReady) {
      // If URL parameters are provided, use them directly
      if (memberParam && price) {
        const { name, num } = parseMemberParam(memberParam);
        setMember({
          name,
          num,
          price: decodeURIComponent(price),
          link: link ? decodeURIComponent(link) : undefined,
        });
        setLoading(false);
      } else {
        // Handle case where parameters are missing
        setLoading(false);
      }
    }
  }, [router.isReady, memberParam, price, link]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e6ceb1] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-[#452005] text-lg sm:text-xl md:text-2xl font-serif">
          Loading...
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#e6ceb1] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-[#452005] text-lg sm:text-xl md:text-2xl font-serif text-center px-4">
          No member data available
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Membership Approved - REIGN NEW YORK</title>
        <meta
          name="description"
          content={`Membership approved for ${member.name}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-[#e6ceb1] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 text-center">
        {/* Header Logo */}
        <div className="my-8 flex justify-center items-center">
          <Image
            src="/imgs/logo.svg"
            alt="REIGN NEW YORK"
            width={115}
            height={40}
            priority
            className="w-16 h-auto sm:w-20 sm:h-auto md:w-24 md:h-auto lg:w-28 lg:h-auto xl:w-[115px] xl:h-auto object-contain"
            style={{
              maxWidth: "100%",
              height: "auto",
            }}
          />
        </div>

        {/* Approval Message */}
        <div className="text-[#452005] text-[24px] font-serif my-8 font-normal px-4">
          Your membership has been approved!
        </div>

        {/* Membership Card */}
        <div
          className="bg-[#452005] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 my-6 sm:my-8 md:my-10 lg:my-12 relative shadow-lg w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] min-h-[220px] sm:min-h-[220px] md:min-h-[220px] lg:min-h-[220px] h-[220px] flex flex-col justify-between mx-4"
        >
          <div className="absolute top-5 right-5">
            <Image
              src="/imgs/brand.svg"
              alt="brand"
              width={50}
              height={60}
              // className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-[80px] xl:h-[80px] object-contain"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
          <div className="absolute bottom-2 left-3 sm:bottom-3 sm:left-4 md:bottom-4 md:left-6 lg:bottom-4 lg:left-8 xl:bottom-10 xl:left-10 text-[#e6ceb1] text-[24px] font-['Palatino_Linotype','Book_Antiqua',Palatino,serif] truncate max-w-[60%]">
            {member.name}
          </div>
          <div className="absolute bottom-2 right-3 sm:bottom-3 sm:right-4 md:bottom-4 md:right-6 lg:bottom-4 lg:right-8 xl:bottom-10 xl:right-10 text-[#e6ceb1] text-[24px] font-['Palatino_Linotype','Book_Antiqua',Palatino,serif] uppercase truncate max-w-[35%]">
            {member.num}
          </div>
        </div>

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif my-8  leading-relaxed max-w-[90vw] sm:max-w-[500px] px-4">
          Your annual member dues are ${member.price}. Your member number is{" "}
          {member.num}.
        </div>

        {/* Payment Button */}
        {member?.link ? (
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#452005] text-[#e6ceb1] border-none rounded-[0.375rem] px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4 text-[14px] font-semibold cursor-pointer shadow-lg transition-all duration-300 font-sans hover:bg-[#3a1a04] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-lg max-w-[280px] sm:max-w-[320px] md:max-w-none inline-block text-center no-underline"
          >
            Go to Payment
          </a>
        ) : (
          <button className="bg-[#452005] text-[#e6ceb1] border-none rounded-[0.375rem] px-6 py-3 sm:px-8 sm:py-3 md:px-10 md:py-4 text-[14px] font-semibold cursor-pointer shadow-lg transition-all duration-300 font-sans hover:bg-[#3a1a04] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-lg max-w-[280px] sm:max-w-[320px] md:max-w-none">
            Go to Payment
          </button>
        )}
      </div>
    </>
  );
}
