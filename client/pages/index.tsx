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
    if (router.isReady && loading) {
      // Initialize GSAP loader animation
      const initLogoRevealLoader = () => {
        if (typeof window === 'undefined' || !window.gsap) return;
        
        const { gsap } = window;
        if (window.CustomEase) gsap.registerPlugin(window.CustomEase);
        if (window.SplitText) gsap.registerPlugin(window.SplitText);
        
        if (window.CustomEase) {
          window.CustomEase.create("loader", "0.65, 0.01, 0.05, 0.99");
        }

        const wrap = document.querySelector("[data-load-wrap]");
        if (!wrap) return;

        const container = wrap.querySelector("[data-load-container]");
        const bg = wrap.querySelector("[data-load-bg]");
        const progressBar = wrap.querySelector("[data-load-progress]");
        const logo = wrap.querySelector("[data-load-logo]");
        const textElements = Array.from(wrap.querySelectorAll("[data-load-text]"));

        // Reset targets that are * not * split text targets
        const resetTargets = Array.from(
          wrap.querySelectorAll('[data-load-reset]:not([data-load-text])')
        );
        
        // Main loader timeline
        const loadTimeline = gsap.timeline({ 
          defaults: { 
            ease: "loader"
          }
        })
        .set(wrap,{ display: "block" })
        .call(() => console.log("Timeline started"))
        .to(progressBar, { scaleX: 1, duration: 3 })
        .to(logo, { clipPath:"inset(0% 0% 0% 0%)", duration: 3 }, "<")
        .call(() => console.log("Logo animation complete"))
        .to(progressBar,{ scaleX: 0, transformOrigin: "right center", duration: 0.5})
        .call(() => console.log("Progress bar reverse complete"))
        .add("dragonPhase", "<")
        .call(() => {
          console.log("dragonPhase");
          // Show dragon brand image
          const dragonImage = document.createElement('div');
          dragonImage.className = 'dragon-loader';
          dragonImage.innerHTML = '<img src="/imgs/dragon_brand.svg" alt="Dragon Brand" style="width: 200px; height: 200px; object-fit: contain;" />';
          dragonImage.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: #e6ceb1;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 1;
          `;
          document.body.appendChild(dragonImage);
          
          // Remove dragon image after 500ms
          setTimeout(() => {
            if (dragonImage && dragonImage.parentNode) {
              dragonImage.parentNode.removeChild(dragonImage);
            }
          }, 5000);
        }, "dragonPhase")
        .add("hideContent", "dragonPhase+=0.5")
        .to(bg, { yPercent: -101, duration: 1 },"hideContent")
        .set(wrap,{ display: "flex" })
        .call(() => {
          // If URL parameters are provided, use them directly
          if (memberParam && price) {
            const { name, num } = parseMemberParam(memberParam);
            setMember({
              name,
              num,
              price: decodeURIComponent(price),
              link: link ? decodeURIComponent(link) : undefined,
            });
          } else {
            // Set default member data if no parameters provided
            setMember({
              name: "John Doe",
              num: "1",
              price: "1000",
              link: undefined,
            });
          }
          setLoading(false);
        });
        
        // If there are items to hide FOUC for, reset them at the start
        if (resetTargets.length) {
          loadTimeline.set(resetTargets, { autoAlpha: 1 }, 0);
        }
        
        // If there's text items, split them, and add to load timeline
        if (textElements.length >= 2 && window.SplitText) {
          const firstWord = new window.SplitText(textElements[0], { type: "lines,chars", mask: "lines" });
          const secondWord = new window.SplitText(textElements[1], { type: "lines,chars", mask: "lines" });
          
          // Set initial states of the text elements and letters
          gsap.set([firstWord.chars, secondWord.chars], { autoAlpha: 0, yPercent: 125 });
          gsap.set(textElements, { autoAlpha: 1 });

          // first text in
          loadTimeline.to(firstWord.chars, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.6,
            stagger: { each: 0.02 }
          }, 0);

          // first text out while second text in
          loadTimeline.to(firstWord.chars, {
            autoAlpha: 0,
            yPercent: -125,
            duration: 0.4,
            stagger: { each: 0.02 }
          }, ">+=0.4");

          loadTimeline.to(secondWord.chars, {
            autoAlpha: 1,
            yPercent: 0,
            duration: 0.6,
            stagger: { each: 0.02 }
          }, "<");

          // second text out
          loadTimeline.to(secondWord.chars, {
            autoAlpha: 0,
            yPercent: -125,
            duration: 0.4,
            stagger: { each: 0.02 }
          }, "hideContent-=0.5");
        }
      };

      // Wait for GSAP to load, then initialize
      const checkGSAP = () => {
        if (window.gsap) {
          initLogoRevealLoader();
        } else {
          setTimeout(checkGSAP, 100);
        }
      };
      
      checkGSAP();
      
      // // Fallback: Show dragon image after 4 seconds if GSAP fails
      setTimeout(() => {
        console.log("Fallback dragon phase triggered");
        const dragonImage = document.createElement('div');
        dragonImage.className = 'dragon-loader';
        dragonImage.innerHTML = '<img src="/imgs/dragon_brand.svg" alt="Dragon Brand" style="width: 178px; height: 80px; object-fit: contain;" />';
        dragonImage.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #FAEFE0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          opacity: 1;
        `;
        document.body.appendChild(dragonImage);
        
        setTimeout(() => {
          if (dragonImage && dragonImage.parentNode) {
            dragonImage.parentNode.removeChild(dragonImage);
          }
        }, 1500);
      }, 4500);
    }
  }, [router.isReady, memberParam, price, link, loading]);

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading - REIGN NEW YORK</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/imgs/faicon.svg" type="image/svg+xml" />
          <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/CustomEase.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js"></script>
        </Head>
        <div data-load-wrap className="loader">
          <div data-load-bg className="loader__bg">
            <div data-load-progress className="loader__bg-bar"></div>
          </div>
          <div data-load-container className="loader__container">
            <div className="loader__logo-wrap">
              <div className="loader__logo-item is--base">
                <Image
                  src="/imgs/gray_logo.svg"
                  alt="REIGN NEW YORK"
                  width={178}
                  height={40}
                  priority
                  className="loader__logo-img"
                />
              </div>
              <div data-load-logo className="loader__logo-item is--top">
                <Image
                  src="/imgs/cream_logo.svg"
                  alt="REIGN NEW YORK"
                  width={178}
                  height={40}
                  priority
                  className="loader__logo-img"
                />
              </div>
            </div>
            {/* <div className="loader__text-wrap">
              <span data-load-text data-load-reset className="loader__text-el">Hold tight</span>
              <span data-load-text data-load-reset className="loader__text-el">Memebers Only</span>
            </div> */}
          </div>
          
          <style jsx>{`
            .loader {
              z-index: 100;
              color: #fff;
              width: 100%;
              height: 100dvh;
              position: fixed;
              inset: 0% 0% auto;
            }

            .loader__bg {
              background-color: #40220B;
              width: 100%;
              height: 100%;
              position: absolute;
              inset: 0%;
            }

            .loader__container {
              z-index: 2;
              flex-flow: column;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              display: flex;
              position: relative;
            }

            .loader__bg-bar {
              z-index: 1;
              transform-origin: 0%;
              transform-style: preserve-3d;
              background-color: #FAEFE0;
              width: 100%;
              height: .2em;
              position: absolute;
              inset: auto 0% 0%;
              transform: scale3d(0, 1, 1);
            }

            .loader__logo-wrap {
              justify-content: center;
              align-items: center;
              width: 12em;
              height: 3em;
              display: flex;
              position: relative;
            }

            .loader__logo-item {
              width: 100%;
              position: absolute;
            }

            .loader__logo-item.is--base {
              opacity: .3;
            }

            .loader__logo-item.is--top {
              -webkit-clip-path: inset(0% 100% 0% 0%);
              clip-path: inset(0% 100% 0% 0%);
            }

            .loader__logo-img {
              width: 100%;
              display: block;
            }

            .loader__text-wrap {
              flex-flow: column;
              justify-content: center;
              align-items: center;
              display: flex;
              position: absolute;
              bottom: 3.5em;
            }

            .loader__text-el {
              text-transform: uppercase;
              white-space: nowrap;
              margin-bottom: -.25em;
              padding-bottom: .25em;
              font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;
              position: absolute;
              color: #452005;
            }

            [data-load-reset]{ opacity: 0; }
          `}</style>
        </div>
      </>
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

      <div className="min-h-screen bg-[#FAEFE0] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 text-center">
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
