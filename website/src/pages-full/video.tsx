import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import IframeContainer from "../components/ui/IframeContainer"
import PageHeading from "../components/ui/PageHeading"

const VideoPage = () => {
  return (
    <NavLayout>
      <SEO
        title="Video"
        image="/meta-video-hero.jpg"
        description="We felt like being vloggers for exactly one day and decided to play a game to share with you all. Hope you enjoy!"
      />
      <PageHeading>Video: The Alisha &amp; Milind Face-off</PageHeading>
      <div className="c-article">
        <p>
          In 2019, in our excitement for the wedding, we decided to channel
          influencer vlogger energy for a day. We battled it out in a classic
          Ellen-inspired challenge where we answer questions about each other
          for our friends and family to get to know us as a couple.
        </p>
        <p>
          Who do you think is the pickier eater? Who is more likely to talk
          their way out of a speeding ticket? Who will survive longer on a
          deserted island? Watch this video to find out! (Closed captions are
          available in video settings)
        </p>
      </div>
      <div className="w-full px-2 py-3">
        <IframeContainer
          width={560}
          height={315}
          src="https://www.youtube.com/embed/Qf-f7i0WZkY"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video: The Alisha &amp; Milind Face-off"
          containerClassName="bg-black text-white"
        />
      </div>
    </NavLayout>
  )
}

export default VideoPage
