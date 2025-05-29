import { useRef, useEffect, useLayoutEffect } from "react";
import { Rive, Layout, Fit, Alignment } from "@rive-app/canvas";

export const PitchDeck = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const riveRef   = useRef<Rive>();

    useLayoutEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width  = width * dpr;
        canvas.height = height * dpr;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.scale(dpr, dpr);
        riveRef.current?.resizeDrawingSurfaceToCanvas?.();
        };
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(canvas.parentElement!);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || riveRef.current) return;
    
        const rive = new Rive({
          src: "/dfc_pitchdeck.riv",
          canvas,
          autoplay: true,
          artboard: "Main_AB",
          stateMachines: ["Main_SM"],
          layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.TopCenter,
          }),
          autoBind: true,
          onLoad: () => {
    
            
          },
        });
    
        rive.resizeDrawingSurfaceToCanvas();
    
        riveRef.current = rive;
        return () => {
          rive.cleanup();
          riveRef.current = undefined;
        };
        
      }, []);


    return (
        <>
      {/* Hero Section */}
      <section
        style={{
          position: 'relative',
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'url("https://walrus.tusky.io/MhpyhbrbXnfDc9NSu7FUA8n8SSd-LYfjaj6LsGeiFeI")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 1,
          }}
        />

        {/* SVG Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            height: '50%',
            backgroundImage:
              'url("https://walrus.tusky.io/at4flnqLp77HsvP0UA4EikaPz_oClSioU6dAO19r0-E")',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 2,
          }}
        >
          {/* Game Description Label */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translate(-50%, 0)',
              zIndex: 3,
              textAlign: 'center',
              color: 'white',
              fontFamily: 'girassol-regular',
              fontSize: '1.5rem',
              padding: '20px',
              width: '100%',
            }}
          >
            A multiplayer, creepy-cozy fishing TCG built on SUI
          </div>
        </div>
      </section>

      {/* <section
        style={{
          position: 'relative',
          width: '100%',
          padding: '2rem 2rem',
          backgroundColor: 'black',
          textAlign: 'center',
          color: 'white',
          fontFamily: 'girassol-regular',
          fontSize: '1rem',
        }}
      >
        <h2 style={{ marginBottom: '1rem', fontFamily: 'girassol-regular' }}>
            Welcome to Darkshore Fishing Club
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            A creepy-cozy fishing game that blends strategic gameplay with Web3 asset ownership—set in a moody lakeside world where the bizarre meets the beautiful.
        </p>
      </section>

      <section
        style={{
          width: '100%',
          padding: '2rem',
          backgroundColor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <video
          src="https://walrus.tusky.io/WFqY30lohFfL7Rp02jo0dZrLgdiozu7AfRJOxzOatiw"
          controls
          style={{
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          }}
        >
          Your browser does not support the video tag.
        </video>
      </section> */}

      {/* Problem Section: Text Left, Image Right */}
    <section
        style={{
            position: 'relative',         // enable absolute positioning of label
            display: 'flex',
            alignItems: 'center',
            padding: '4rem 2rem',
        }}
        >
            {/* Tiny Top-Left Label */}
            <div
                style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                fontFamily: 'girassol-regular',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                zIndex: 2,
                }}
            >
                Problem
            </div>

            {/* Text Side */}
            <div
                style={{
                flex: 1,
                paddingRight: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
                }}
            >
                <h2 style={{ fontFamily: 'girassol-regular', marginBottom: '1rem' }}>
                    "Crypto" Games
                </h2>
                <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                Games like Roblox, Candy Crush, and Dota 2 prove that wildly different audiences exist within gaming—each drawn to distinct mechanics, aesthetics, and engagement styles.
                But most crypto games ignore this. Instead, designing around generic gameplay loops—hoping to attract users from existing game segments without understanding what those players actually want.
                </p>
                <p style={{ lineHeight: 1.6 }}>
                The result?
                Web3 still lacks its “Halo” or “Wii Bowling”—that breakout title which proves the platform’s value and justifies its existence to mainstream gamers.
                </p>
            </div>

            {/* Image Side */}
            <div
                style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
                }}
            >
                <img
                src="https://walrus.tusky.io/wtnJv_YD5QB4xD0vd0SNJ2SI0-6kbH_cLuu74Z4NfHU"
                alt="Problem illustration"
                style={{
                    width: '70%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                />
            </div>
    </section>


      {/* Solution Section: Image Left, Text Right */}
    <section
        style={{
            position: 'relative',   // Enable absolute positioning for the label
            display: 'flex',
            alignItems: 'center',
            padding: '4rem 2rem',
        }}
        >
            {/* Tiny Top-Left Label */}
            <div
                style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                fontFamily: 'girassol-regular',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                zIndex: 2,
                }}
            >
                Solution
            </div>

            {/* Image Side */}
            <div
                style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
                }}
            >
                <img
                src="https://walrus.tusky.io/N5M5HHgrw5TUPogXYoBVVe72u2ypexOGjduP_cUpMWQ"
                alt="Solution illustration"
                style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                />
            </div>

            {/* Text Side */}
            <div style={{ flex: 1, padding: '2rem', width: '50%', zIndex: 1 }}>
                <h2 style={{ fontFamily: 'girassol-regular', marginBottom: '1rem' }}>
                Welcome to Darkshore Fishing Club
                </h2>
                <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                A game with a distinct identity—rooted in a moody, creepy-cozy art style and brought to life through a blockchain-native, generative NFT fishing mechanic.

                Unlike most crypto games, DFC doesn’t treat tokens as an afterthought. The core gameplay loop is designed from the ground up around ownership, creativity, and dynamic content—things that only blockchain can offer.

                Instead of chasing hype or mimicking Web2 games, DFC offers players a compelling reason to engage:
                </p>
                <ul style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                <li>Focused, tight gameplay.</li>
                <li>Beautifully hand-crafted assets.</li>
                <li>Striking, original visual and audio design.</li>
                <li>Meaningful NFT ownership tied directly to in-game performance.</li>
                </ul>
                <p style={{ lineHeight: 1.6 }}>
                This isn't Web2 with tokens duct-taped on. It's a game designed
                from the ground up with Web3 in mind.
                </p>
            </div>
    </section>
        

    {/* Simple Game Loop */}
    {/* <section
        style={{ display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%',
            backgroundColor: 'black', textAlign: 'left', color: 'white', fontFamily: 'girassol-regular', fontSize: '1rem', }} >
        <h2 style={{ marginBottom: '1rem', fontFamily: 'girassol-regular' }}>
            Simple Game Loop
        </h2>
        <img src="https://walrus.tusky.io/ZznN4hfgB4cfPbeUoXlJlCPmtha7BKr93LKv0ZR1CGM" alt="Game Loop Example" style={{ width: '100%', height: 'auto' }} />
    </section> */}

    {/* Break Image */}
    {/* <section
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            width: '100%', backgroundColor: 'black', marginBottom: '2rem', marginTop: '2rem' }} >
        <img src="https://walrus.tusky.io/Q-wy_cGsPVVxrj8qp4Y9WRODba9JctX3bfDhOBfveRc" alt="Trout Variants" style={{ width: '40%', height: 'auto' }} />
    </section> */}

    {/* Second-Screen Inspiration Section */}
    <section
        style={{
            position: 'relative',
            width: '100%',
            minHeight: '60vh',
            backgroundImage:
            'url("https://walrus.tusky.io/ZznN4hfgB4cfPbeUoXlJlCPmtha7BKr93LKv0ZR1CGM")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            color: 'white',
        }}
        >
            {/* Tiny Top-Left Label */}
        <div
            style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 2,
            fontFamily: 'girassol-regular',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            }}
        >
            Game Loop
        </div>
        {/* Optional translucent overlay for better contrast */}
        <div
            style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
            }}
        />
        {/* Text Container */}
        <div
            style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '800px',
            }}
        >
            <h2
            style={{
                fontFamily: 'girassol-regular',
                fontSize: '2rem',
                marginBottom: '1rem',
            }}
            >
                Simple Game Loop
            </h2>
            <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                Inspired by Netflix's "second-screen" design strategy, DFC provides an experience that fits into modern life. It doesn't demand constant attention—players can fish while scrolling through social media or watching TV. But when they do engage, the strategy runs deep and the rewards are on chain.
            </p>
        </div>
    </section>
    

    {/* Second-Screen Inspiration Section */}
    <section
        style={{
            position: 'relative',
            width: '100%',
            minHeight: '60vh',
            backgroundImage:
            'url("https://walrus.tusky.io/tacQMAtx7KdsjwpuaimBpbdbxwXQBGu1RIDUhCJ0fXA")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            color: 'white',
        }}
        >
            {/* Tiny Top-Left Label */}
            <div
                style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                zIndex: 2,
                fontFamily: 'girassol-regular',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                }}
            >
                Theme
            </div>

            {/* Optional translucent overlay for better contrast */}
            <div
                style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1,
                }}
            />

            {/* Text Container */}
            <div
                style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '800px',
                }}
            >
                <h2
                style={{
                    fontFamily: 'girassol-regular',
                    fontSize: '2rem',
                    marginBottom: '1rem',
                }}
                >
                Theme
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                Creepy-Cozy—a term I've coined to describe DFC's aesthetic.
                It's not horror, but it's always slightly unsettling.
                Heavy ink strokes, lo-fi ambience, and off-kilter music create a
                hauntingly beautiful atmosphere where relaxing gameplay meets
                eerie intrigue.
                </p>
            </div>
        </section>

        {/* Theme Section */}
        <section
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '60vh',
                backgroundImage:
                'url("https://walrus.tusky.io/QVi9dGE7XOTjL3p1rpb6iVHnHJLwrIVkaLSoNlYu_L4")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem',
                color: 'white',
            }}
            >
                {/* Tiny Top-Left Label */}
                <div
                    style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 2,
                    fontFamily: 'girassol-regular',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    }}
                >
                    Tokenomics
                </div>

                {/* Optional translucent overlay for better contrast */}
                <div
                    style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1,
                    }}
                />

                {/* Text Container */}
                <div
                    style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '800px',
                    }}
                >
                    <h2
                    style={{
                        fontFamily: 'girassol-regular',
                        fontSize: '2rem',
                        marginBottom: '1rem',
                    }}
                    >
                    Treasures in the Deep
                    </h2>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        <b>Earn:</b> Tokens would be earned by players for selling rare catches, finding sunken treasure and during seasonal Fishing Tournaments. 
                    </p>
                    <p style={{ fontSize: '1rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                        <b>Spend:</b> Used to purchase new cards, upgrade boats, and craft rare fishing poles.
                    </p>
                </div>
        </section>

        {/* Roadmap */}
    <section
        style={{
            position: 'relative',
            width: '100%',
            minHeight: '60vh',
            backgroundImage:
            'url("https://walrus.tusky.io/brPK-_HMQ2Zxc_xulnepYMJ6HAMx5bq0BP4pRPcoUCw")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            color: 'white',
        }}
        >
         <div
            style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            zIndex: 2,
            fontFamily: 'girassol-regular',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            }}
        >
            Roadmap
        </div>
        <div
            style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
            }}
        />
        <div
            style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '800px',
            }}
        >
            <h2
            style={{
                fontFamily: 'girassol-regular',
                fontSize: '2rem',
                marginBottom: '1rem',
            }}
            >
                The Long Road Ahead
            </h2>
            <ul style={{ lineHeight: 1.6, marginBottom: '1rem', fontSize: '1rem', textAlign: 'left' }}>
                <li>Use your boat to explore and fish in different locations on the lake.</li>
                <li>Weather, temperature and advanced fish behavior simulations to create deep gameplay.</li>
                <li>Crafting system where players craft new cards, poles, boats and NFT options.</li>
                <li>Seasonal Fishing Tournaments with prizes.</li>
                <li>Much, much more.</li>
            </ul>
        </div>
    </section>


    {/* Team Section: Text Left, Image Right */}
    <section
        style={{
            position: 'relative',         // enable absolute positioning of label
            display: 'flex',
            alignItems: 'center',
            padding: '4rem 2rem',
        }}
        >
            {/* Tiny Top-Left Label */}
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', fontFamily: 'girassol-regular', fontSize: '0.75rem', textTransform: 'uppercase',
                backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', zIndex: 2, }} >
            Team
            </div>

            {/* Text Side */}
            <div
                style={{
                flex: 1,
                paddingRight: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
                }}
            >
                <h2 style={{ fontFamily: 'girassol-regular', marginBottom: '1rem' }}>
                    Builder
                </h2>
                <p style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                    As a solo developer and artist, I move fast, iterate often, and build with purpose. Since 2010, I’ve worked in indie game development across art, code, and production. I moved into Web3 in 2020, and in just the past year:
                </p>
                <ul style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                    <li>Built the most popular NFT collection on Arweave</li>
                    <li>Won or placed in 5 major hackathons</li>
                    <li>Took 3 first-place bounties at ETH Denver 2025</li>
                </ul>
                <p style={{ lineHeight: 1.6 }}>
                    I'm a lifelong outdoorsman raised in the Pacific Northwest, now raising the next generation on the same traditions.
                </p>
            </div>

            {/* Image Side */}
            <div
                style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
                }}
            >
                <img
                src="https://walrus.tusky.io/cXC1B0T9AOK0zd_HJ0a8NsGalUwj3fCqY73vx_ixxg4"
                alt="Team illustration"
                style={{
                    width: '70%',
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
                />
            </div>
    </section>

        {/* Break Image */}
        <section
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                width: '100%', marginBottom: '2rem' }} >
            <img src="https://walrus.tusky.io/I6UwsvlyCRJP8ZXJIcczYoSzRq5jBlh2TW8mRgWchSk" alt="Trout Variants" style={{ width: '60%', height: 'auto' }} />
        </section>

        {/* SUI Tech Used */}
        <section
            style={{ display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '2rem 2rem',
                backgroundColor: 'black', textAlign: 'left', color: 'white', fontFamily: 'girassol-regular', fontSize: '1rem', }} >
            <h2 style={{ marginBottom: '1rem', fontFamily: 'girassol-regular' }}>
                SUI Tech Used
            </h2>
            <p style={{ maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            DFC utilizes many tools in the ecosystem to provide users with unique, runtime generative NFTs.
            </p>
            <ul style={{ lineHeight: 1.6, marginBottom: '1rem' }}>
                <li> SUI: The blockchain powering the game and its generative NFTs.</li>
                <li> SUIET Wallet Kit: Provides the primary app connection to SUI from the users wallet.</li>
                <li>Tusky: Uploads dynamically created NFT to the SUI network. </li>
                <li>Walrus: Serves files with Walrus CDN for blob ids. </li>
            </ul>
            <img src="https://walrus.tusky.io/4VhQPDiL-vYm7shCuoZpt6WpfzonXjvpjEolWRgRf-I" alt="SUI Logos" style={{ width: '40%', height: 'auto' }} />
        </section>

        {/* Game Tech Used */}
        <section
            style={{ display: 'flex',  flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '2rem 2rem',
                backgroundColor: 'black', textAlign: 'left', color: 'white', fontFamily: 'girassol-regular', fontSize: '1rem', }} >
            <h2 style={{ marginBottom: '1rem', fontFamily: 'girassol-regular' }}>
                Tech Used
            </h2>
            <img src="https://walrus.tusky.io/ier9-jZGSMgDVowyGJrHjuGkLvZI7q03Rm1eWNvn2Hs" alt="SUI Logos" style={{ width: '40%', height: 'auto' }} />
        </section>
    
    </>
    )
}
