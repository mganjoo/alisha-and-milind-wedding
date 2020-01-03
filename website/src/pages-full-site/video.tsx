import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import IframeContainer from "../components/ui/IframeContainer"
import PageHeading from "../components/ui/PageHeading"

const VideoPage = () => {
  return (
    <NavLayout>
      <SEO title="Video" image="/meta-video-hero.jpg" />
      <PageHeading>Video: The Alisha &amp; Milind Face-off</PageHeading>
      <div className="c-article">
        <p>
          In our excitement for the wedding, we decided to channel those famous
          YouTube vloggers for a day. We made this video where we answer
          questions about each other in an Ellen-inspired challenge, for our
          friends and family to get to know us as a couple.
        </p>
        <p>
          Who do you think is the pickier eater? Who is more likely to talk
          their way out of a parking ticket? Who will survive longer on a
          deserted island? Watch this video to find out!
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
