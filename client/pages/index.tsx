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
  const [showTransition, setShowTransition] = useState<boolean>(false);

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

  // Function to format price with commas for numbers greater than 1000
  const formatPrice = (price: string): string => {
    const numericPrice = parseFloat(price);
    if (numericPrice >= 1000) {
      return numericPrice.toLocaleString();
    }
    return price;
  };

  // Function to convert Arabic numbers to Roman numerals
  const arabicToRoman = (num: number): string => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    
    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];
      }
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

      // Get the number (last part) - could be Roman or Arabic
      const numberPart = parts[parts.length - 1];
      
      // Check if it's already an Arabic number
      const isArabicNumber = !isNaN(parseInt(numberPart));
      
      let arabicNumber: number;
      if (isArabicNumber) {
        // If it's already an Arabic number, use it directly
        arabicNumber = parseInt(numberPart);
      } else {
        // If it's a Roman numeral, convert to Arabic
        arabicNumber = romanToArabic(numberPart);
      }

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
      // Show loading screen for 3 seconds
      const timer = setTimeout(() => {
        // Start transition animation
        setShowTransition(true);
        
        // After transition completes, show main content
        const transitionTimer = setTimeout(() => {
          // If URL parameters are provided, use them directly
          if (memberParam && price) {
            const { name, num } = parseMemberParam(memberParam);
            setMember({
              name,
              num,
              price: decodeURIComponent(price),
              link: link ? decodeURIComponent(link) : undefined,
            });
          }
          setLoading(false);
        }, 1000); // Transition duration

        return () => clearTimeout(transitionTimer);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [router.isReady, memberParam, price, link]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading - REIGN NEW YORK</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/imgs/faicon.svg" type="image/svg+xml" />
        </Head>
        <div className="min-h-screen relative overflow-hidden">
          {/* Loading screen with logo */}
          <div 
            className="min-h-screen bg-[#e6ceb1] flex items-center justify-center p-4 sm:p-6 md:p-8"
            style={{
              animation: 'fadeUp 3s ease-in-out'
            }}
          >
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
                animation: 'logoFadeIn 1s ease-in-out 0.5s both'
              }}
            />
          </div>
          
          {/* White transition screen */}
          {showTransition && (
            <div 
              className="absolute inset-0 bg-white z-10"
              style={{
                animation: 'collapseUp 1s ease-in-out'
              }}
            />
          )}
          
          <style jsx>{`
            @keyframes fadeUp {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes logoFadeIn {
              0% {
                opacity: 0;
                transform: scale(0.8);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
            @keyframes collapseUp {
              0% {
                transform: translateY(100%);
              }
              100% {
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </>
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
        <link rel="icon" href="/imgs/faicon.svg" type="image/svg+xml" />
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
        <div className="text-[#452005] text-[18px] font-serif my-6 font-normal px-4">
          Your membership has been approved!
        </div>

        {/* Membership Card */}
        <div
          className="bg-[#452005] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 my-4 relative shadow-lg w-[70vw] max-w-[320px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[400px] flex flex-col justify-between mx-4"
          style={{
            aspectRatio: '1.585 / 1',
            minHeight: 'auto'
          }}
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
          <div className="absolute bottom-6 left-6 text-[#e6ceb1] text-[22px] font-['Palatino_Linotype','Book_Antiqua',Palatino,serif] truncate max-w-[60%]">
            {member.name}
          </div>
          <div className="absolute bottom-6 right-6 text-[#e6ceb1] text-[22px] font-['Palatino_Linotype','Book_Antiqua',Palatino,serif] uppercase truncate max-w-[35%]">
            {arabicToRoman(parseInt(member.num))}
          </div>
        </div>

        {/* Membership Details */}
        <div className="text-[#452005] text-[18px] font-serif my-6 leading-relaxed max-w-[90vw] sm:max-w-[500px] px-4">
          Your annual member dues are ${formatPrice(member.price)}. Your <br /> member number is{" "}
          {arabicToRoman(parseInt(member.num))}.
        </div>

        {/* Payment Button */}
        {member?.link ? (
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#452005] text-[#e6ceb1] border-none rounded-[0.375rem] px-8 py-2 text-[14px] font-semibold cursor-pointer shadow-lg transition-all duration-300 font-sans hover:bg-[#3a1a04] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-lg max-w-[280px] sm:max-w-[320px] md:max-w-none inline-block text-center no-underline"
          >
            Go to Payment
          </a>
        ) : (
          <button className="bg-[#452005] text-[#e6ceb1] border-none rounded-[0.375rem] px-8 py-2 text-[14px] font-semibold cursor-pointer shadow-lg transition-all duration-300 font-sans hover:bg-[#3a1a04] hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 active:shadow-lg max-w-[280px] sm:max-w-[320px] md:max-w-none">
            Go to Payment
          </button>
        )}
      </div>
    </>
  );
}
