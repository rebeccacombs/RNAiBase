import NextImage from 'next/image';
import Link from 'next/link';
import { Anchor, Card, Group, Image, Text, Title } from '@mantine/core';
import Arrow from '@/public/arrow.svg';
import Bar from '@/public/bar.svg';
import LogoSmall from '@/public/logosmall.svg';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { Tag } from './Tag';
import classes from './Welcome.module.css';

export function Welcome() {
  
  return (
    <>
      <div className={classes.flexContainer}>
        <div className={classes.itemLeft}>
          <Tag />
        </div>

        {/* logo and title */}
        <div className={classes.titleContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="205"
            height="50"
            viewBox="0 0 205 50"
            fill="none"
            className={classes.logo}
          >
            <path
              className="svg-path"
              d="M102.366 25.368C120.885 -8.70352 166.391 6.11812 202.244 25.3681"
              strokeWidth="9"
            />
            <path
              className="svg-path"
              d="M102.878 25C84.3596 59.0716 38.8537 44.2499 3 25"
              strokeWidth="9"
            />
            <path
              className="svg-path"
              d="M164.598 32.868C152.561 44.607 120.354 46.3324 102.622 25.3681"
              stroke="#F48024"
              strokeWidth="9"
            />
            <path
              className="svg-path"
              d="M40.9026 17.3679C52.9393 5.62892 84.8907 4.40363 102.622 25.368"
              stroke="#F48024"
              strokeWidth="9"
            />
            <line
              className="svg-path"
              x1="180.885"
              y1="17.368"
              x2="180.885"
              y2="24.868"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              x1="116.86"
              y1="11.868"
              x2="116.86"
              y2="24.868"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              x1="149.128"
              y1="8.86804"
              x2="149.128"
              y2="24.868"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              x1="149.128"
              y1="24.868"
              x2="149.128"
              y2="40.868"
              stroke="#F48024"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              x1="133.25"
              y1="24.868"
              x2="133.25"
              y2="40.868"
              stroke="#F48024"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              x1="116.86"
              y1="24.868"
              x2="116.86"
              y2="36.368"
              stroke="#F48024"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              x1="133.25"
              y1="8.86804"
              x2="133.25"
              y2="24.868"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              x1="164.494"
              y1="12.368"
              x2="164.494"
              y2="24.868"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="7.5"
              y2="-4.25"
              transform="matrix(-0.0140616 -0.999901 0.99991 -0.0134 26.6665 33.2944)"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="16.4309"
              y2="-4.25"
              transform="matrix(-0.000366009 -1 1 -0.000348786 90.5857 41.368)"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="16"
              y2="-4.25"
              transform="matrix(-0.0140615 -0.999901 0.99991 -0.0133999 58.5393 41.368)"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="16"
              y2="-4.25"
              transform="matrix(-0.0140615 -0.999901 0.99991 -0.0133999 58.3142 25.3695)"
              stroke="#F48024"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="16"
              y2="-4.25"
              transform="matrix(-0.0140615 -0.999901 0.99991 -0.0133999 74.1909 25.1567)"
              stroke="#F48024"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="11.5"
              y2="-4.25"
              transform="matrix(-0.0140615 -0.999901 0.99991 -0.0133999 90.5796 24.9371)"
              stroke="#F48024"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="16"
              y2="-4.25"
              transform="matrix(-0.0140616 -0.999901 0.99991 -0.0134 74.416 41.1553)"
              strokeWidth="8.5"
            />
            <line
              className="svg-path"
              y1="-4.25"
              x2="12.5"
              y2="-4.25"
              transform="matrix(-0.0140615 -0.999901 0.99991 -0.0133999 43.1257 38.0742)"
              strokeWidth="8.5"
            />
          </svg>

          <Title order={1} className={`${classes.title} ${classes.boldFont}`} ta="center">
            RNAi
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={{ from: 'orange', to: 'blue' }}
            >
              Base
            </Text>
          </Title>
        </div>

        {/* color scheme toggle */}
        <div className={classes.itemRight}>
          <ColorSchemeToggle />
        </div>
      </div>

      <Text
        className={`${classes.heading1} ${classes.lightFont}`}
        ta="center"
        size="lg"
        maw={600}
        mx="auto"
      >
        The omnibus for RNA interference research and development.
      </Text>

      <Text
        className={`${classes.heading2} ${classes.spaceFont}`}
        ta="center"
        size="lg"
        maw={950}
        mx="auto"
        mt="lg"
      >
        We have compiled over 500 academic papers from PubMed since 2017 to view the relationships
        between where research today is being done and the relevant populations affected by RNAi
        diseases and medications. A project through the{' '}
        <Anchor
          inherit
          target="_blank"
          underline="always"
          href="http://pro-sirna.com/lab/team.html"
          size="lg"
          className={classes.hyperlink}
        >
          Pro-siRNA Lab
        </Anchor>{' '}
        at Duke Kunshan University.
      </Text>

      <Text
        className={`${classes.heading1} ${classes.boldFont}`}
        ta="center"
        size="lg"
        maw={900}
        mx="auto"
        mt="lg"
      >
        Insights into the field
      </Text>

      <Group className={classes.groupContainer}>
        <Link href="/visualizations" prefetch={true} passHref className={classes.cardLink}>
          <Card className={classes.card} style={{ backgroundColor: '#E6EBFF' }}>
            <Text className={`${classes.cardText}`} style={{ color: '#2b4678' }}>
              Visualizations
            </Text>
            <div className={classes.cardIconContainer}>
              <Image component={NextImage} src={Bar} alt="Bar Chart" className={classes.cardIcon} />
            </div>
            <div className={classes.arrowContainer}>
              <Image component={NextImage} src={Arrow} alt="Arrow Icon" />
            </div>
          </Card>
        </Link>

        <Link href="/papers" passHref className={classes.cardLink}>
          <Card className={classes.card} style={{ backgroundColor: '#A66538' }}>
            <Text className={`${classes.cardText}`} style={{ color: '#ffffff' }}>
              Papers
            </Text>
            <div className={classes.cardIconContainer}>
              <Image
                component={NextImage}
                src={LogoSmall}
                alt="Small Logo"
                className={classes.cardIcon}
              />
            </div>
            <div className={classes.arrowContainer}>
              <Image
                component={NextImage}
                src={Arrow}
                alt="Arrow Icon"
                style={{ filter: 'invert(1) brightness(2)' }}
              />
            </div>
          </Card>
        </Link>
      </Group>
    </>
  );
}
