import React from "react"
import NavLayout from "../components/layout/NavLayout"
import SEO from "../components/meta/SEO"
import IframeContainer from "../components/ui/IframeContainer"
import PageHeading from "../components/ui/PageHeading"

const VideoPage = () => {
  return (
    <NavLayout>
      <SEO title="The Story" image="/meta-video-hero.jpg" />
      <PageHeading>Video</PageHeading>
      <div className="c-article">
        <p>
          We are so thrilled to celebrate our wedding weekend with you and could
          not be more thankful for your presence in our lives. In our own
          excitement, we decided that we wanted to be like those famous YouTube
          vloggers for a day.
        </p>
        <p>
          Who do you think is the pickier eater? Who will survive longer on a
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
          title="Video: 16 Questions with Alisha and Milind"
          containerClassName="bg-black text-white"
        />
      </div>
    </NavLayout>
  )
}

export default VideoPage
